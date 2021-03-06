import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements';
import { withRouter } from 'react-router-native';

import { getCurrentChallenge, storeChallengeByDate, getChallengeAttemptDates, getChallengeAttemptsByDate, markChallengeAttemptSavedRemotely } from "../data/async-storage";
import { getUpcomingChallengesByDate } from "../data/parse-client/getters";
import { saveChallengeAttempt } from "../data/parse-client/actions";
import { setSourceChallengeData } from "../data/redux/challengeData";

class ChallengeOverview extends Component {
  constructor() {
    super();

    this.state = {
      currentChallenge: null,
      currentChallengeAttempts: [],
      pastChallengeDates: [],
    };
  }

  componentDidMount() {
    this._getCurrentChallenge();
    this._getChallengeAttemptDates();
  }

  render() {
    const { currentChallenge, currentChallengeAttempts, pastChallengeDates } = this.state;

    // console.log('current challenge:', currentChallenge);
    // console.log('current attempts:', currentChallengeAttempts);

    return (
      <View>
        <ListItem onPress={() => this.props.history.push(`/challenge`)}
          title={ currentChallenge ? "Play Now" : "Searching for Current Challenge" }
        />
        { currentChallengeAttempts.length > 0 ?
          <ListItem title="Attempts" containerStyle={styles.divider} />
          : null
        }
        { currentChallengeAttempts.map( (attempt, index) =>
          <ListItem
            key={index} style={styles.listItem}
            title={ attempt.score + " points" }
            rightTitle={ attempt.savedRemotely.toString() }
            onPress={() => this.props.history.push(`/challengeAttemptReview/${currentChallenge.date}/${attempt.attemptIndex}`)}
          />
        )}
        <ListItem title="Past Challenges" containerStyle={styles.divider} />
        { pastChallengeDates.map( (date, index) =>
          <ListItem
            title={ date }
            key={index}
            onPress={() => this.props.history.push(`/challengeAttempts/${date}`)}
          />
        )}
      </View>
    )
  }

  // queries async-storage for the current challenge, queries Parse if not found
  _getCurrentChallenge() {
    getCurrentChallenge(this.props.userID)
      .then( (challenge) => {
        if (challenge) {
          this.setState({
            currentChallenge: challenge,
          });
          this._getCurrentChallengeAttempts(challenge.date);
          this.props.setSourceChallengeData(challenge);
        } else {
          this._getUpcomingChallengesByDate();
        }
      });
  }

  // queries async-storage for attempts based on the current challenge date
  _getCurrentChallengeAttempts(date) {
    getChallengeAttemptsByDate(this.props.userID, date)
      .then( (attempts) => {

        // mark each attempt's index, then sort based on score
        // index is used when retrieving specific attempts
        const markedAttempts = attempts.map( (attempt, attemptIndex) => {
          return {
            ...attempt,
            attemptIndex
          };
        }).sort( (a, b) => {
          if (a.score > b.score) return -1;
          if (a.score < b.score) return 1;
          if (a.savedRemotely) return -1;
          return 0;
        });

        // should try to save the first game remotely, if it isn't already saved
        // doing it here will make it fairly automatic while not repeating too frequently in case there's an error
        if (markedAttempts.length > 0 && !markedAttempts[0].savedRemotely) {
          console.log('trying to save attempt:', markedAttempts[0]);
          this._saveChallengeAttempt(markedAttempts[0], date, markedAttempts[0].attemptIndex);
        }

        this.setState({
          currentChallengeAttempts: markedAttempts
        });
      });
  }

  // saves an attempt remotely
  _saveChallengeAttempt(attempt, currentChallengeDate, attemptIndex) {
    saveChallengeAttempt(attempt)
      .then( () => {
        markChallengeAttemptSavedRemotely(this.props.userID, currentChallengeDate, attemptIndex)
          .then( () => {
            this._getCurrentChallengeAttempts(currentChallengeDate);
          });
      });
  }

  // queries Parse server for upcoming challenges and saves to local storage
  _getUpcomingChallengesByDate() {
    getUpcomingChallengesByDate()
      .then( async (challenges) => {
        const dates = Object.keys(challenges);
        for (let i = 0; i < dates.length; i++) {
          const date = dates[i];
          await storeChallengeByDate(this.props.userID, challenges[date], date)
            .catch( (err) => {
              console.log('error:', err);
            });
        }
        this._getCurrentChallenge();
      });
  }

  // get array of attempt dates
  _getChallengeAttemptDates() {
    getChallengeAttemptDates(this.props.userID)
      .then( (dates) => {
        this.setState({
          pastChallengeDates: dates,
        });
      });
  }
}

const styles = StyleSheet.create({
  listItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  divider: {
    backgroundColor: 'lightgray',
  }
});

const mapStateToProps = (state) => {
  return {
    userID: state.user.uid,
  };
};

const mapDispatchToProps = {
  setSourceChallengeData,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChallengeOverview));