import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import GamePieceSection from '../components/GamePieceSection';
import GameBoard from '../components/GameBoard';

import { setGameboardLocation } from "../ducks/display";


class Game extends Component {
  render() {
    return (
      <Container>
        <View><Text>{this.props.display.displayWord}</Text></View>
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

const mapStateToProps = (state) => {
  return {
    display: state.display
  };
};

const mapDispatchToProps = {
  setGameboardLocation
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));