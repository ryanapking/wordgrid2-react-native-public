import React, { Component } from 'react';
import {PanResponder, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-native';

import GameBoardPathCreator from './GameBoardPathCreator';
import DrawBoard from './DrawBoard';

import { consumeSquare, removeSquare, clearConsumedSquares } from "../ducks/gameData";
import { setGameboardLocation, newConsumeSquare } from "../ducks/gameDisplay";
import {SPACE_CONSUMED, SPACE_EMPTY, SPACE_FILLED} from "../constants";

class GameBoard extends Component {
  constructor() {
    super();

    this._onStartShouldSetPanResponderCapture = this._onStartShouldSetPanResponderCapture.bind(this);
    this._onMoveShouldSetPanResponderCapture = this._onMoveShouldSetPanResponderCapture.bind(this);
    this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
    this._onPanResponderMove = this._onPanResponderMove.bind(this);
    this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: this._onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponderCapture: this._onMoveShouldSetPanResponderCapture,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease
    });
  }

  render() {
    const { game, display } = this.props;

    // if a word has already been played, we don't need any of this to be possible
    const pointerEvents = this.props.game.word ? 'none' : 'auto';

    // console.log('game rows:', game.rows);

    const displayBoardState = game.rows.map( (row, rowIndex) => {
      return row.map( (letter, columnIndex) => {
        if (!letter) {
          return {letter, status: SPACE_EMPTY};
        } else if (!this._checkSquareAvailable({rowIndex, columnIndex})) {
          return {letter, status: SPACE_CONSUMED};
        } else {
          return {letter, status: SPACE_FILLED};
        }
      });
    });

    // console.log('displayBoardState:', displayBoardState);

    return(
      <View style={[this.props.style, styles.gameBoardView]}>
        <View style={styles.base} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this._onLayout()}>
          <TouchableOpacity onPressIn={(event) => this._boardPress(event)} pointerEvents={pointerEvents}>
            <DrawBoard boardState={displayBoardState} boardSize={display.boardLocation.width}/>
          </TouchableOpacity>
          <GameBoardPathCreator squares={game.consumedSquares} boardLocation={display.boardLocation}/>
        </View>
      </View>
    );
  }

  _boardPress(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

    if(!square.letter) return;

    if (this._checkSquareAdjacent(square) && this._checkSquareAvailable(square)) {
      this.props.consumeSquare(square, this.props.gameID);
    } else if (!this._checkIfLastSquarePlayed(square)) {
      this.props.clearConsumedSquares(this.props.gameID);
      this.props.consumeSquare(square, this.props.gameID)
    }
  }

  _findSquareByCoordinates(x, y) {

    const { rowMidPoints, columnMidPoints } = this.props.display.boardLocation;
    const maxRowDiff = this.props.display.boardLocation.rowHeight / 2;
    const maxColumnDiff = this.props.display.boardLocation.columnWidth / 2;

    let square = { rowIndex: -1, columnIndex: -1};

    for (let rowIndex = 0; rowIndex < rowMidPoints.length; rowIndex++) {
      const rowDiff = Math.abs(rowMidPoints[rowIndex] - y);
      if ( rowDiff < maxRowDiff ) square.rowIndex = rowIndex;
    }

    for (let columnIndex = 0; columnIndex < columnMidPoints.length; columnIndex++) {
      const rowDiff = Math.abs(columnMidPoints[columnIndex] - x);
      if ( rowDiff < maxColumnDiff ) square.columnIndex = columnIndex;
    }

    const onBoard = (square.rowIndex >= 0 && square.columnIndex >= 0);
    const letter = onBoard ? this.props.game.rows[square.rowIndex][square.columnIndex] : null;

    return {...square, letter};
  }

  _checkSquareAdjacent(square) {
    // if this is the first piece consumed, that's all we need to check
    if (this.props.game.consumedSquares.length === 0) return true;

    // checks a square against the previous square to determine if they are adjacent
    const previousSquare = this.props.game.consumedSquares[this.props.game.consumedSquares.length - 1];

    const columnDiff = Math.abs(previousSquare.columnIndex - square.columnIndex);
    const rowDiff = Math.abs(previousSquare.rowIndex - square.rowIndex);

    return (
      square.letter
      && (rowDiff <= 1)
      && (columnDiff <= 1)
      && (columnDiff + rowDiff !== 0)
    );
  }

  _checkSquareAvailable(square) {
    return this.props.game.consumedSquares.reduce( (available, compareSquare ) => {
      const rowClash = (square.rowIndex === compareSquare.rowIndex);
      const columnClash = (square.columnIndex === compareSquare.columnIndex);
      return (available && (!rowClash || !columnClash));
    }, true);
  }

  _checkIfLastSquarePlayed(square) {
    // simple function, but it's long and ugly
    if (this.props.game.consumedSquares.length < 1) {
      return false;
    } else {
      return (
        square.rowIndex === this.props.game.consumedSquares[this.props.game.consumedSquares.length - 1].rowIndex
        && square.columnIndex === this.props.game.consumedSquares[this.props.game.consumedSquares.length - 1].columnIndex
      );
    }
  }

  _checkIfNextToLastSquarePlayed(square) {
    // same as above... simple but long and ugly
    if (this.props.game.consumedSquares.length < 2) {
      return false;
    } else {
      return (
        square.rowIndex === this.props.game.consumedSquares[this.props.game.consumedSquares.length - 2].rowIndex
        && square.columnIndex === this.props.game.consumedSquares[this.props.game.consumedSquares.length - 2].columnIndex
      );
    }
  }

  _onPanResponderGrant(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

    if(!square.letter) return;

    if (this._checkSquareAdjacent(square) && this._checkSquareAvailable(square)) {
      this.props.consumeSquare(square, this.props.gameID);
    } else if (!this._checkIfLastSquarePlayed(square)) {
      this.props.clearConsumedSquares(this.props.gameID);
      this.props.consumeSquare(square, this.props.gameID)
    }
  }

  _onPanResponderMove(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

    console.log('moved');

    if(!square.letter) return;

    if (square.columnIndex === -1 || square.rowIndex === -1) {
      // do nothing if event is not on a valid square
      // note: square can be invalid if the point clicked is outside of the circle used to define its space
      // this is no big deal in the current setup
    } else if (this._checkIfNextToLastSquarePlayed(square)) {
      // allows for backtracking while spelling a word
      this.props.removeSquare(this.props.gameID);
    } else if (this._checkSquareAdjacent(square) && this._checkSquareAvailable(square)) {
      this.props.consumeSquare(square, this.props.gameID);
    }
  }

  _onPanResponderRelease() {
    if (this.props.game.consumedSquares.length === 1) {
      this.props.clearConsumedSquares(this.props.gameID);
    }
  }

  _onStartShouldSetPanResponderCapture() {
    return true;
  }

  _onMoveShouldSetPanResponderCapture() {
    return true;
  }

  _onLayout() {
    this.gameBoard.measure((x, y, width, height, pageX, pageY) => {
      // console.log('measure:', {x, y, width, height, pageX, pageY});
      this.props.setGameboardLocation(pageX, pageY, width, height);
    });
  }
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    aspectRatio: 1
  },
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
    display: state.gameDisplay,
  }
};

const mapDispatchToProps = {
  consumeSquare,
  removeSquare,
  clearConsumedSquares,
  setGameboardLocation,
  newConsumeSquare
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameBoard));