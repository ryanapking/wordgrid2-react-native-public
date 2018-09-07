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
    this.state = {
      // the most recent square added to the word
      currentSquare: {rowIndex: -1, columnIndex: -1},
    };

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

  _onPanResponderGrant(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

    this.setState({
      currentSquare: {rowIndex: square.rowIndex, columnIndex: square.columnIndex},
    });

    this.props.consumeSquare(square);

    this.props.setDisplayWord(square.letter);
  }

  _onPanResponderMove(event) {
    const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

    const columnDiff = Math.abs(this.state.currentSquare.columnIndex - square.columnIndex);
    const rowDiff = Math.abs(this.state.currentSquare.rowIndex - square.rowIndex);

    const squareValid = (
      square.letter
      && (rowDiff <= 1)
      && (columnDiff <= 1)
      && (columnDiff + rowDiff !== 0)
    );

    if (!squareValid) return;

    const squareAvailable = this.props.consumedSquares.reduce( (available, compareSquare ) => {
      const rowClash = (square.rowIndex === compareSquare.rowIndex);
      const columnClash = (square.columnIndex === compareSquare.columnIndex);
      const noClash = !(rowClash && columnClash);
      return (available && noClash);
    }, true);

    if (squareAvailable) {
      this.setState({
        currentSquare: square
      });

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