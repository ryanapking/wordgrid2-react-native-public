import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { Button, Container, Spinner } from "native-base";

import GameWordDisplay from "./GameWordDisplay";
import GamePieceSection from "./GamePieceSection";

import { getWinner, localToRemote } from "../utilities";

class GameInteraction extends Component {
  constructor() {
    super();

    this.state = {
      working: false
    };

    this.saveRemoteMove = this.saveRemoteMove.bind(this);
  }

  render() {
    const wordPlayed = !!this.props.game.word;
    let interaction = null;

    if (this.state.working) {
      interaction = <Spinner color='blue' />;
    } else if (!wordPlayed) {
      interaction =
        <Container style={[styles.flex]}>
          <GameWordDisplay style={[styles.twoColumns]}/>
          <GamePieceSection style={[styles.twoColumns]} pieces={this.props.game.me} />;
        </Container>;
    } else if (!this.props.game.piecePlaced) {
      interaction = <GamePieceSection pieces={this.props.game.me} allowDrag />;
    } else {
      interaction = <Button full onPress={() => this.saveRemoteMove()}><Text>Submit Move</Text></Button>
    }

    return (
      <Container style={this.props.style}>
        { interaction }
      </Container>
    );
  }

  saveRemoteMove() {

    this.setState({
      working: true
    });

    const gameID = this.props.gameID;
    const userID = this.props.uid;
    const localGameData = this.props.game;

    const gameDocRef = firebase.firestore().collection('games').doc(gameID);
    const newMove = localToRemote(localGameData, this.props.uid);

    const newGameObject = {
      ...localGameData,
      history: [
        ...localGameData.history, newMove
      ]
    };

    const winner = getWinner(newGameObject);

    firebase.firestore().runTransaction( (transaction) => {

      return transaction.get(gameDocRef).then( (gameDoc) => {

        if (!gameDoc.exists) return;

        // if there is no opponent yet, set the turn to "p2", which will be used for querying games when trying to join a new one
        let turn = "p2";

        // if there is an opponent, set the turn value to their uid
        if (winner) {
          turn = "over";
        } else if ( localGameData.p1 !== null && localGameData.p1 !== userID ) {
          turn = localGameData.p1;
        } else if ( localGameData.p2 !== null && localGameData.p2 !== userID ) {
          turn = localGameData.p2;
        }

        transaction.update(gameDocRef, {
          h: newGameObject.history,
          t: turn,
          w: winner
        });

      });

    }).then( () => {
      console.log('game update succeeded');
    }).catch( (err) => {
      console.log('game update error:', err);
    }).finally( () => {
      this.setState({
        working: false
      })
    });

  }
}

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  twoColumns: {
    flexBasis: '50%',
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',
  }
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
    uid: state.user.uid
  };
};

export default withRouter(connect(mapStateToProps)(GameInteraction));