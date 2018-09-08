import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import GamePieceSection from '../components/GamePieceSection';
import GameBoard from '../components/GameBoard';

import { setGameboardLocation } from "../ducks/gameDisplay";


class Game extends Component {
  render() {
    const displayWord = this.props.consumedSquares.reduce( (word, square) => word + square.letter, "");

    return (
      <Container>
        <View><Text>{displayWord}</Text></View>
        <View style={styles.gameBoardView} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this._onLayout()}>
          <GameBoard />
        </View>
        <View style={{backgroundColor: 'lightgray'}}>
          <GamePieceSection />
        </View>
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
    game: state.gameData.games.byID[gameID],
    display: state.display,
    consumedSquares: state.gameData.consumedSquares
  };
};

const mapDispatchToProps = {
  setGameboardLocation
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));