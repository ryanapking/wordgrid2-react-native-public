import React, { Component } from 'react';
import {PanResponder, StyleSheet, Text, View} from 'react-native';
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-native';

import GameBoardPathCreator from './GameBoardPathCreator';
import GameLetter from './GameLetter';

import { consumeSquare, removeSquare, clearConsumedSquares } from "../ducks/gameData";
import { setGameboardLocation } from "../ducks/gameDisplay";

class GameBoard extends Component {
  constructor() {
    super();

    this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
    this._onPanResponderMove = this._onPanResponderMove.bind(this);
    this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: GameBoard._panResponderCaptureTrue,
      onMoveShouldSetPanResponderCapture: GameBoard._panResponderCaptureTrue,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease
    });
  }

  render() {
    const { game } = this.props;

    // if a word has already been played, we don't need any of this to be possible
    const pointerEvents = this.props.game.word ? 'none' : 'auto';

    return(
      <View style={[this.props.style, styles.gameBoardView]}>
        <View style={styles.base} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this._onLayout()}>
          <View style={styles.grid} {...this.panResponder.panHandlers} pointerEvents={pointerEvents}>
            {game.rows.map((row, rowIndex) =>
              <View key={rowIndex} style={styles.row}>
                {row.map( (letter, columnIndex) => {
                  const fillStyle = this._getSquareFillStyle(rowIndex, columnIndex, letter);
                  return (
                    <View key={columnIndex} style={[styles.centered, styles.column, this._getSquareFillStyle(rowIndex, columnIndex, letter)]}>
                      <GameLetter letter={letter} style={fillStyle} letterHeight={this.props.display.boardLocation.rowHeight}/>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
          <GameBoardPathCreator />
        </View>
      </View>
    );
  }

  _getSquareFillStyle(rowIndex, columnIndex, letter) {
    const squareUsed = this.props.game.consumedSquares.reduce( (foundStatus, square) => {
      return (foundStatus || (rowIndex === square.rowIndex && columnIndex === square.columnIndex));
    }, false);
    if (squareUsed) {
      return styles.usedSquare;
    } else if (letter) {
      return styles.filledSquare;
    } else {
      return styles.emptySquare;
    }
  }

  _findSquareByCoordinates(x, y) {
    // to better enable diagonal movements, we define a circle 85% of its max possible size, to cut off the corners
    // kinda like a connect four board
    // we could use an octagon, but this math is simpler
    const maxDistance = this.props.display.boardLocation.columnWidth / 2 * .85;

    const nullIndex = -1;
    const nullSquare = {rowIndex: nullIndex, columnIndex: nullIndex};

    // reduce the two midpoint arrays into a single set of coordinates at the given point
    const square = this.props.display.boardLocation.rowMidPoints.reduce( (foundSquare, midPointY, rowIndex) => {
      const columnIndex = this.props.display.boardLocation.columnMidPoints.reduce( (foundColumnIndex, midPointX, columnIndex) => {
        const dist = Math.hypot(x - midPointX, y - midPointY);
        return dist < maxDistance ? columnIndex : foundColumnIndex;
      }, nullIndex);
      return columnIndex >= 0 ? {rowIndex, columnIndex} : foundSquare;
    }, nullSquare);

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

    if (this._checkSquareAdjacent(square) && this._checkSquareAvailable(square)) {
      this.props.consumeSquare(square, this.props.gameID);
    } else if (!this._checkIfLastSquarePlayed(square)) {
      this.props.clearConsumedSquares(this.props.gameID);
      this.props.consumeSquare(square, this.props.gameID)
    }
  }

  _onPanResponderMove(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

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

  static _panResponderCaptureTrue() {
    return true;
  }

  _onLayout() {
    this.gameBoard.measureInWindow((x, y, width, height) => {
      this.props.setGameboardLocation(x, y, width, height);
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
  grid: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  column: {
    flex: 1
  },
  letter: {
    fontSize: 20
  },
  filledSquare: {
    backgroundColor: "#ffd27b",
  },
  emptySquare: {
    backgroundColor: "#9c9c9c"
  },
  usedSquare: {
    backgroundColor: "#ffa487",
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  setGameboardLocation
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameBoard));