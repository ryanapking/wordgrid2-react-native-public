import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { Button, Container, Spinner } from "native-base";

import GameWordDisplay from "./GameWordDisplay";
import DrawPieceSection from "./DrawPieceSection";

import { getWinner, localToRemote } from "../utilities";
import { setLocalGameDataByID } from "../ducks/gameData";

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
      interaction = this._getSpinner();
    } else if (!wordPlayed) {
      interaction = this._getPlayWord();
    } else if (!this.props.game.piecePlaced) {
      interaction = this._getPlacePiece();
    } else {
      interaction = this._getConfirmMove();
    }

    return (
      <Container style={this.props.style}>
        { interaction }
      </Container>
    );
  }

  _getSpinner() {
    return (
      <Spinner color='blue' />
    );
  }

  _getPlayWord() {
    return (
      <Container style={[styles.flex]}>
        <DrawPieceSection style={[styles.twoColumns]} pieces={this.props.game.me} />
        <GameWordDisplay style={[styles.twoColumns]}/>
      </Container>
    );
  }

  _getPlacePiece() {
    return (
      <DrawPieceSection pieces={this.props.game.me} allowDrag />
    );
  }

  _getConfirmMove() {
    return (
      <View style={styles.confirmMoveSection}>
        <Button full info onPress={() => this.saveRemoteMove()}><Text>Submit Move</Text></Button>
        <Button full info onPress={() => this.clearLocalMoveData()}><Text>Reset Move</Text></Button>
      </View>
    );
  }

  clearLocalMoveData() {
    this.props.setLocalGameDataByID(this.props.gameID, this.props.uid, this.props.game.sourceData);
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

    // console.log('new game object', newGameObject);

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
          w: winner,
          m: firebase.firestore.FieldValue.serverTimestamp(), // timestamp modification time
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
  },
  confirmMoveSection: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
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

const mapDispatchToProps = {
  setLocalGameDataByID
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameInteraction));