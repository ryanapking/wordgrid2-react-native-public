import React, { Component } from 'react';
import { PanResponder } from 'react-native';
import {Col, Grid, Row} from "react-native-easy-grid";
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-native';

import GridSquare from "./GridSquare";

class GameBoard extends Component {
  constructor() {
    super();
    this.state = {
      currentSquare: {rowIndex: -1, columnIndex: -1},
      drawnWord: "",
      wordLetters: []
    }
  }


  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (event, gestureState) => {
        const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);
        this.state.currentSquare = {rowIndex: square.rowIndex, columnIndex: square.columnIndex};
        this.state.drawnWord = square.letter;
        this.state.wordLetters.push(square);
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (event, gestureState) => {

        const square = this._findSquareByCoordinates(event.nativeEvent.pageX, event.nativeEvent.pageY);

        const columnDiff = Math.abs(this.state.currentSquare.columnIndex - square.columnIndex);
        const rowDiff = Math.abs(this.state.currentSquare.rowIndex - square.rowIndex);

        // let squareAvailable = true;

        const squareValid = (
          square.letter
          && (rowDiff <= 1)
          && (columnDiff <= 1)
          && (columnDiff + rowDiff !== 0)
        );

        if (!squareValid) return;

        console.log("here here here");

        const squareAvailable = this.state.wordLetters.reduce( ( available, compareSquare ) => {
          const rowClash = (square.rowIndex === compareSquare.rowIndex);
          const columnClash = (square.columnIndex === compareSquare.columnIndex);
          const noClash = !(rowClash && columnClash);
          return (available && noClash);
        }, true);

        if (squareAvailable) {
          this.state.drawnWord += square.letter;
          this.state.wordLetters.push(square);
          this.state.currentSquare = square;
          console.log(this.state.drawnWord);
        }

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
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
    // compare point to row bounds and return row index
    const maxRowDiff = this.props.display.gameBoard.rowHeight / 2;
    const maxColumnDiff = this.props.display.gameBoard.columnWidth / 2;

    // compare point to row bounds and return row index
    const rowIndex = this.props.display.gameBoard.rowMidPoints.reduce( ( foundRow, midPointY, index ) => {
      const rowDiff = Math.abs(midPointY - y);
      if ( rowDiff < maxRowDiff ) {
        return index;
      } else {
        return foundRow;
      }
    }, -1 );

    // compare point to column bounds and return column index
    const columnIndex = this.props.display.gameBoard.columnMidPoints.reduce( ( foundColumn, midPointX, index) => {
      const columnDiff = Math.abs(midPointX - x);
      if ( columnDiff < maxColumnDiff ) {
        return index;
      } else {
        return foundColumn;
      }
    }, -1);

    const onBoard = (rowIndex >= 0 && columnIndex >= 0);
    const letter = onBoard ? this.props.board.rows[rowIndex][columnIndex] : null;

    return {rowIndex, columnIndex, letter};
  }
}

const mapStateToProps = (state) => {
  return {
    board: state.board,
    display: state.display
  }
};

const mapDispatchToProps = {

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameBoard));