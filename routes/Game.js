import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import GamePieceSection from '../components/GamePieceSection';
import GameWordDisplay from '../components/GameWordDisplay';
import GameBoard from '../components/GameBoard';

import { setGameboardLocation } from "../ducks/gameDisplay";


class Game extends Component {
  render() {
    const displayWord = this.props.game.consumedSquares.reduce( (word, square) => word + square.letter, "");
    const wordPlayed = !!this.props.game.word;

    console.log('wordPlayed: ', wordPlayed);

    return (
      <Container>
        <View style={styles.gameBoardView} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this._onLayout()}>
          <GameBoard />
        </View>
        { !wordPlayed ?
          <GameWordDisplay />
          :
          <GamePieceSection />
        }
      </Container>
    );
  }

  _onLayout() {
    this.gameBoard.measureInWindow((x, y, width, height) => {
      this.props.setGameboardLocation(x, y, width, height);
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
  };
};

const mapDispatchToProps = {
  setGameboardLocation
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));