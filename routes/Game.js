import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import GamePieceSection from '../components/GamePieceSection';
import GameWordDisplay from '../components/GameWordDisplay';
import GamePhaseDisplay from '../components/GamePhaseDisplay';
import GameBoard from '../components/GameBoard';

import { setGameboardLocation } from "../ducks/gameDisplay";


class Game extends Component {
  render() {
    const wordPlayed = !!this.props.game.word;

    let interaction = null;

    // console.log('piece placed? ', this.props.game.piecePlaced);

    if (!wordPlayed) {
      interaction = <GameWordDisplay />;
    } else if (!this.props.game.piecePlaced) {
      interaction = <GamePieceSection />;
    }

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