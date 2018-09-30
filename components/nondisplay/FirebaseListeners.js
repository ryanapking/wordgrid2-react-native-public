import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import firebase from 'react-native-firebase';

import { getOpponentName, setLocalGameDataByID, setLocalGameIDs } from "../../ducks/gameData";

class FirebaseListeners extends Component {
  constructor() {
    super();

    this.state = {
      gameListenerIDs: [],
      gameListeners: {},
      userListenerID: null,
      userListener: null
    };

    this.manageRemoteGameListSync = this.manageRemoteGameListSync.bind(this);
    this.manageRemoteGameSyncs = this.manageRemoteGameSyncs.bind(this);
  }

  render() {
    return null;
  }

  componentWillUnmount() {
    console.log('firebase listeners component will unmount');
  }

  componentDidMount() {
    this.manageRemoteGameListSync();
  }

  componentDidUpdate() {
    this.manageRemoteGameListSync();
  }

  manageRemoteGameListSync() {

    // we probably don't need to do anything and don't want to repeat this function to prevent duplicate listeners
    if ( this.props.userID === this.state.userListenerID ) {
      return;
    } else if ( this.state.userListener ) {
      this.state.userListener();
    }

    console.log('user game list sync starting');

    const userDocRef = firebase.firestore().collection('users').doc(this.props.userID);

    const userListener = userDocRef.onSnapshot( (userDoc) => {
      if (!userDoc.exists) return;
      const gameIDs = userDoc.data().games ? userDoc.data().games : [];
      this.props.setLocalGameIDs(gameIDs);
      this.manageRemoteGameSyncs(gameIDs, this.props.userID);
    });

    this.setState({
      userListenerID: this.props.userID,
      userListener
    });

  }

  manageRemoteGameSyncs(gameIDs, userID) {

    // remove the non-firebase uuid stuff
    const currentRemoteGameIDs = gameIDs.map( (gameID) => {
      return gameID.id;
    });

    // grab the already present listeners, to prevent duplicates
    const alreadyListening = this.state.gameListenerIDs;

    // figure out which new listeners would be duplicates
    // add the other listeners
    currentRemoteGameIDs.filter( (gameID) => {
      return !alreadyListening.includes(gameID);
    }).forEach( (gameID) => {

      console.log('starting sync for new game:', gameID);
      const gameDocRef = firebase.firestore().collection('games').doc(gameID);
      gameDocRef.onSnapshot( (gameDoc) => {

        if (!gameDoc.exists) return;
        this.props.setLocalGameDataByID(gameID, userID, gameDoc.data());
        this.props.getOpponentName(gameID);

      });

    });

    this.setState({
      gameListenerIDs: currentRemoteGameIDs
    });

  }

}

const mapStateToProps = (state) => {
  return {
    userID: state.user.uid,
    gameData: state.gameData,
    allIDs: state.gameData.allIDs
  };
};

const mapDispatchToProps = {
  getOpponentName,
  setLocalGameDataByID,
  setLocalGameIDs
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FirebaseListeners));