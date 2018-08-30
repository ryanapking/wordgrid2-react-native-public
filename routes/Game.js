import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Container } from 'native-base';

import GamePieceSection from '../components/GamePieceSection';
import GameBoard from '../components/GameBoard';


export default class Game extends Component {
  onLayout() {
    this.gameBoard.measureInWindow((x, y, width, height) => {
      console.log("x, y: ", x, y);
      console.log(width, height);
    });
  }

  render() {
    const window = Dimensions.get('window');

    // console.log("window: ", window);

    const boardWidth = window.width;
    const boardHeight = boardWidth;

    return (
      <Container>
        <View style={{height: boardHeight, width: boardWidth, flex: 0}} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this.onLayout()}>
          <GameBoard />
        </View>
        <View style={{backgroundColor: 'lightgray'}}>
          <GamePieceSection />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    // backgroundColor: '#ffd27b',
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: 'white',
  }
});