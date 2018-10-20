import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import config from '../utilities/config';
import { getScoreBoard } from "../utilities";

class GameScoreBoard extends Component {
  render() {
    // console.log('history:', this.props.game.history);
    // console.log('config:', config);
    const scoreBoard = getScoreBoard(this.props.game);

    console.log("score board:", scoreBoard);

    const playerMoves = { p1: [1, 2, 3, 4, 5], p2: [5, 4, 3, 1]};
    const emptyMoves = new Array(config.naturalTurns).fill(null);

    let p1 = playerMoves.p1;
    let p2 = playerMoves.p2;

    if (p1.length < config.naturalTurns) {
      p1 = emptyMoves.map( (empty, index) => {
        if (index in p1) {
          return p1[index];
        } else {
          return null;
        }
      });
    }

    if (p2.length < config.naturalTurns) {
      p2 = emptyMoves.map( (empty, index) => {
        if (index in p2) {
          return p2[index];
        } else {
          return null;
        }
      });
    }

    const displayValues = p1.map( (val, index) => {
      return {
        p1: val,
        p2: p2[index]
      }
    });

    console.log('display values:', displayValues);

    if (playerMoves.p1.length > config.naturalTurns) {
      console.log('greater than 4');
    } else {
    }
    // console.log('player moves: ', playerMoves);
    return (
      <Container>
        <Container style={styles.row}>
          {playerMoves.p1.map( (moveValue, index) =>
            <Text key={index}>{ moveValue }</Text>
          )}
        </Container>
        <Container style={styles.row}>
          {playerMoves.p2.map( (moveValue, index) =>
            <Text key={index}>{ moveValue }</Text>
          )}
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row'
  }
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    game: state.gameData.byID[gameID],
  };
};

export default withRouter(connect(mapStateToProps)(GameScoreBoard));