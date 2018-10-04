import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Container, Button, Spinner} from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import firebase from "react-native-firebase";

import GamePieceSection from '../components/GamePieceSection';
import GameWordDisplay from '../components/GameWordDisplay';
import GamePhaseDisplay from '../components/GamePhaseDisplay';
import GameBoard from '../components/GameBoard';

import { setGameboardLocation } from '../ducks/gameDisplay';
import { localToRemote, checkPieceFit } from "../utilities";


class Game extends Component {
  constructor() {
    super();

    this.state = {
      working: false
    };

    this.saveRemoteMove = this.saveRemoteMove.bind(this);
  }

  componentDidMount() {
    // console.log('game.js component mounted');
    // console.log('game:', this.props.game);

    checkPieceFit(this.props.game.me, this.props.game.rows);
  }

  render() {
    const wordPlayed = !!this.props.game.word;

    let interaction = null;

    // console.log('piece placed? ', this.props.game.piecePlaced);
    // console.log('game state:', this.props.game);

    if (this.state.working) {
      interaction = (
        <Container>
          <Spinner color='blue' />
        </Container>
      );
    } else if (!wordPlayed) {
      interaction = <GameWordDisplay />;
    } else if (!this.props.game.piecePlaced) {
      interaction = <GamePieceSection />;
    } else {
      interaction = <Button full onPress={() => this.saveRemoteMove()}><Text>Submit Move</Text></Button>
    }

    // interaction = <GamePieceSection />;

    // console.log('interaction: ', interaction);

    return (
      <Container>
        <GamePhaseDisplay/>
        <View style={styles.gameBoardView} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this._onLayout()}>
          <GameBoard />
        </View>
        { interaction }
      </Container>
    );
  }

  componentDidUpdate() {
    if ( this.props.uid !== this.props.game.turn ) {
      this.props.history.push(`/games`);
      console.log('redirecting...');
      console.log('uid:', this.props.uid);
      console.log('turn:', this.props.game.turn);
    }
  }

  _onLayout() {
    this.gameBoard.measureInWindow((x, y, width, height) => {
      this.props.setGameboardLocation(x, y, width, height);
    });
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

    console.log('localGameData:', localGameData);
    console.log('newMove:', newMove);

    firebase.firestore().runTransaction( (transaction) => {

      return transaction.get(gameDocRef).then( (gameDoc) => {

        if (!gameDoc.exists) return;

        const currentHistory = gameDoc.data().history;

        // if there is no opponent yet, set the turn to "p2", which will be used for querying games when trying to join a new one
        let turn = "p2";

        // if there is an opponent, set the turn value to their uid
        if ( localGameData.p1 !== null && localGameData.p1 !== userID ) {
          turn = localGameData.p1;
        } else if ( localGameData.p2 !== null && localGameData.p2 !== userID ) {
          turn = localGameData.p2;
        }

        transaction.update(gameDocRef, {
          history: [ ...currentHistory, newMove ],
          t: turn
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
  gameBoardView: {
    aspectRatio: 1
  },
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
    display: state.display,
    uid: state.user.uid
  };
};

const mapDispatchToProps = {
  setGameboardLocation,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));