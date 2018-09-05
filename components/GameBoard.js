import React, { Component } from 'react';
import { PanResponder } from 'react-native';
import {Col, Grid, Row} from "react-native-easy-grid";
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-native';

import GridSquare from "./GridSquare";

import { setDisplayWord } from "../ducks/display";

class GameBoard extends Component {
  constructor() {
    super();
    this.state = {
      // the most recent square added to the word
      currentSquare: {rowIndex: -1, columnIndex: -1},

      // all squares used, including most recent
      usedSquares: []
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
      <Grid {...this.panResponder.panHandlers}>
        {board.rows.map((row, i) =>
          <Row key={i}>
            {row.map( (letter, i) =>
              <Col key={i}>
                <GridSquare letter={letter} />
              </Col>
            )}
          </Row>
        )}
      </Grid>
    );
  }

  _findSquareByCoordinates(x, y) {
    // to better enable diagonal movements, we define a circle 85% of its max possible size, to cut off the corners
    // kinda like a connect four board
    // we could use an octagon, but this math is simpler
    const maxDistance = this.props.display.gameBoard.columnWidth / 2 * .85;

    const nullIndex = -1;
    const nullSquare = {rowIndex: nullIndex, columnIndex: nullIndex};

    // reduce the two midpoint arrays into a single set of coordinates at the given point
    const square = this.props.display.gameBoard.rowMidPoints.reduce( (foundSquare, midPointY, rowIndex) => {
      const columnIndex = this.props.display.gameBoard.columnMidPoints.reduce( (foundColumnIndex, midPointX, columnIndex) => {
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

    this.state.currentSquare = {rowIndex: square.rowIndex, columnIndex: square.columnIndex};
    this.state.usedSquares.push(square);

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

    const squareAvailable = this.state.usedSquares.reduce( (available, compareSquare ) => {
      const rowClash = (square.rowIndex === compareSquare.rowIndex);
      const columnClash = (square.columnIndex === compareSquare.columnIndex);
      const noClash = !(rowClash && columnClash);
      return (available && noClash);
    }, true);

    if (squareAvailable) {
      this.state.drawnWord += square.letter;
      this.state.usedSquares.push(square);
      this.state.currentSquare = square;

      this.props.setDisplayWord(this.props.display.displayWord + square.letter);
    }
  }

  static _panResponderCaptureTrue() {
    return true;
  }
}

const mapStateToProps = (state) => {
  return {
    board: state.board,
    display: state.display
  }
};

const mapDispatchToProps = {
  setDisplayWord
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameBoard));