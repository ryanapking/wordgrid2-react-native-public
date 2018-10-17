import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Container, Button, Spinner} from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import firebase from "react-native-firebase";
import { Row, Col, Grid } from 'react-native-easy-grid';

import Boggle from '../utilities/boggle-solver';
import GamePieceSection from '../components/GamePieceSection';
import GameWordDisplay from '../components/GameWordDisplay';
import GamePhaseDisplay from '../components/GamePhaseDisplay';
import GameBoard from '../components/GameBoard';

import { localToRemote, checkPieceFit, getWinner } from "../utilities";

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

    // checkPieceFit(this.props.game.me, this.props.game.rows);
    // gameOverCheck(this.props.game);

    const lastItemIndex = this.props.game.history.length - 1;
    const boardState = this.props.game.history[lastItemIndex].b;
    let boggle = new Boggle(boardState);
    boggle.solve( (words) => {
      boggle.print();

      console.log(words.length + ' words');
      console.log(words.join(', '));
    });
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
      interaction = <GamePieceSection pieces={this.props.game.me} allowDrag={true}/>;
    } else {
      interaction = <Button full onPress={() => this.saveRemoteMove()}><Text>Submit Move</Text></Button>
    }

    // interaction = <GamePieceSection pieces={this.props.game.me} allowDrag={true}/>;

    // console.log('interaction: ', interaction);

    return (
      <Container>
        <Grid>
          <Col>
            <Row size={15}>
              <Row>
                <Col>
                  <GamePhaseDisplay/>
                </Col>
                <Col>
                  <Text>Opponent:</Text>
                  <GamePieceSection pieces={this.props.game.them} allowDrag={false} />
                  <Text>Points: {this.props.game.theirScore}</Text>
                </Col>
              </Row>
            </Row>
            <Row size={60}>
              <View style={styles.gameBoardView} >
                <GameBoard />
              </View>
            </Row>
            <Row size={25}>
              { interaction }
              <Text>My score: {this.props.game.myScore}</Text>
              <Text>Their score: {this.props.game.theirScore}</Text>
            </Row>
          </Col>
        </Grid>
      </Container>
    );
  }

  componentDidUpdate() {
    if ( this.props.uid !== this.props.game.turn ) {
      this.props.history.push(`/games`);
      console.log('redirecting...');
      // console.log('uid:', this.props.uid);
      // console.log('turn:', this.props.game.turn);
    }
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
  gameBoardView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
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

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));