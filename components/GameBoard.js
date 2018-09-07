import React, { Component } from 'react';
import {PanResponder, StyleSheet, Text, View} from 'react-native';
import {Col, Grid, Row} from "react-native-easy-grid";
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-native';

import GameBoardPathCreator from './GameBoardPathCreator';

import { setDisplayWord } from "../ducks/gameDisplay";
import { consumeSquare, clearConsumedSquares } from "../ducks/gameChanges";

class GameBoard extends Component {
  constructor() {
    super();

    this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
    this._onPanResponderMove = this._onPanResponderMove.bind(this);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: GameBoard._panResponderCaptureTrue,
      onMoveShouldSetPanResponderCapture: GameBoard._panResponderCaptureTrue,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
    });
  }

  render() {
    const { board } = this.props;

    return(
      <View style={{width: "100%", height: "100%"}}>
        <Grid {...this.panResponder.panHandlers}>
          {board.rows.map((row, rowIndex) =>
            <Row key={rowIndex}>
              {row.map( (letter, columnIndex) => {
                const squareUsed = this.props.consumedSquares.reduce( (foundStatus, square) => {
                  return (foundStatus || (rowIndex === square.rowIndex && columnIndex === square.columnIndex));
                }, false);
                let fillStyle = null;
                if (squareUsed) {
                  fillStyle = styles.usedSquare;
                } else if (letter) {
                  fillStyle = styles.filledSquare;
                } else {
                  fillStyle = styles.emptySquare;
                }
                return (
                  <Col key={columnIndex}>
                    <Text style={[styles.base, fillStyle]}>{letter}</Text>
                  </Col>
                )
              })}
            </Row>
          )}
        </Grid>
        <GameBoardPathCreator />
      </View>
    );
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
    const letter = onBoard ? this.props.board.rows[square.rowIndex][square.columnIndex] : null;

    return {...square, letter};
  }

  _checkSquareAdjacent(square) {
    // if this is the first piece consumed, that's all we need to check
    if (this.props.consumedSquares.length === 0) return true;

    // checks a square against the previous square to determine if they are adjacent
    const previousSquare = this.props.consumedSquares[this.props.consumedSquares.length - 1];

    const columnDiff = Math.abs(previousSquare.columnIndex - square.columnIndex);
    const rowDiff = Math.abs(previousSquare.rowIndex - square.rowIndex);

    const squareValid = (
      square.letter
      && (rowDiff <= 1)
      && (columnDiff <= 1)
      && (columnDiff + rowDiff !== 0)
    );

    return squareValid;
  }

  _onPanResponderGrant(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);
    const squareAdjacent = this._checkSquareAdjacent(square);

    if (squareAdjacent) {
      this.props.consumeSquare(square);
      this.props.setDisplayWord(square.letter);
    } else {
      this.props.clearConsumedSquares();
      this.props.consumeSquare(square)
    }
  }

  _onPanResponderMove(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

    // if we don't have a valid square, stop there
    // square can be invalid if the point clicked is outside of the circle used to define its space
    if (square.columnIndex === -1 || square.rowIndex === -1) return;

    const squareAdjacent = (this._checkSquareAdjacent(square));

    if (!squareAdjacent) return;

    const squareAvailable = this.props.consumedSquares.reduce( (available, compareSquare ) => {
      const rowClash = (square.rowIndex === compareSquare.rowIndex);
      const columnClash = (square.columnIndex === compareSquare.columnIndex);
      const noClash = !(rowClash && columnClash);
      return (available && noClash);
    }, true);

    if (squareAvailable) {
      this.props.consumeSquare(square);
      this.props.setDisplayWord(this.props.display.displayWord + square.letter);
    }
  }

  static _panResponderCaptureTrue() {
    return true;
  }
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    // borderRadius: 5,
    borderColor: 'white',

  },
  filledSquare: {
    backgroundColor: "#ffd27b",
  },
  emptySquare: {
    backgroundColor: "#9c9c9c"
  },
  usedSquare: {
    backgroundColor: "#ffa487",
    // transform: [
    //   { rotate: '-45deg'},
    //   { scale: 1.05 },
    // ],
  },
});

const mapStateToProps = (state) => {
  return {
    board: state.board,
    display: state.display,
    consumedSquares: state.gameChanges.consumedSquares
  }
};

const mapDispatchToProps = {
  setDisplayWord,
  consumeSquare,
  clearConsumedSquares
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameBoard));