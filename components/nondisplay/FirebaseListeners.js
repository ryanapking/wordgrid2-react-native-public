import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import firebase from 'react-native-firebase';

import { startRemoteGameIDSync } from "../../ducks/gameData";

// this component is dumb
// it stores firebase onSnapshot listeners so they can later to deleted
// it dispatch the appropriate local data updates
// i need to be able to remove defunct listeners, like after a game is complete
// i need to prevent duplicate listeners
// this is the best way I can think to do it right now

class FirebaseListeners extends Component {
  constructor() {
    super();
    this.uid = null;
    this.gameIDs = ['cherry'];
    this.gameList = null;
    this.games = {};

    this.onUserSnapshot = this.onUserSnapshot.bind(this);
    this.onGameSnapshot = this.onGameSnapshot.bind(this);
  }

  componentDidMount() {
    // console.log('user id:', this.props.user.uid);
    // this.props.startRemoteGameIDSync(this.props.user.uid);
  }

  componentDidUpdate() {
    if (this.uid !== this.props.user.uid) {
      this.uid = this.props.user.uid;

      // this should be moved elsewhere and this whole component scrapped
      this.props.startRemoteGameIDSync(this.uid);

      // unsubscribe from any previous lists
      if (this.gameList) this.gameList();

      this.gameList = this.createUserListener(this.uid);
    }
  }

  createUserListener(uid) {
    return firebase.firestore().collection('users').doc(uid).onSnapshot( this.onUserSnapshot )
  }

  createGameListener(gameID) {
    return firebase.firestore().collection('games').doc(gameID).onSnapshot( this.onGameSnapshot );
  }

  onUserSnapshot(doc) {
    // just ... stop
    return;
    // this is the dumb, ugly function
    // set listeners for new games
    // remove listeners for defunct games

    // probably an error if the doc doesn't exist
    // just wait until it does
    if (!doc.exists) return;

    const remoteIDs = ("games" in doc.data()) ? doc.data().games : [];

    // for any new games, set a listener
    const newGames = remoteIDs.filter( (gameID) => {
      return !this.gameIDs.includes(gameID);
    });

    newGames.forEach( (gameID) => {
      this.games[gameID] = this.createGameListener(gameID);
    });

    // the returned list of gameIDs is now our local list
    this.gameIDs = remoteIDs;

    // filter for games that are no longer found in firebase
    const removedGames = Object.keys(this.games)
      .filter( (gameID) => {
        return !this.gameIDs.includes(gameID);
      });

    // remove listeners for these games
    removedGames.forEach( (gameID) => {
      if (this.game[gameID]) this.games[gameID]();
      delete this.games[gameID];
    });

    // console.log('this.games', this.games);
    // console.log('this.gameIDs', this.gameIDs);

  }

  onGameSnapshot(doc) {
    console.log('game snapshot:', doc.data());
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    gameList: state.gameData.allIDs
  }
};

const mapDispatchToProps = {
  startRemoteGameIDSync
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FirebaseListeners));