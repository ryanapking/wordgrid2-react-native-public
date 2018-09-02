import React, { Component } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated, Dimensions } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import GridSquare from './GridSquare';

class GamePiece extends Component {

  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      dragging: false,
      canDrop: false,
      baseHeight: 0,
      baseWidth: 0,
      currentHeight: 0,
      currentWidth: 0,
      relativeMiddlePoints: []
    };
    this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
    this._onPanResponderMove = this._onPanResponderMove.bind(this);
    this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
    this._getLettersBelowPiece = this._getLettersBelowPiece.bind(this);
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this.state.scale.addListener((value) => this._setCurrentSize(value));

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: GamePiece._panResponderCaptureTrue,
      onMoveShouldSetPanResponderCapture: GamePiece._panResponderCaptureTrue,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
    });
  }

  render() {
    const { pan, scale } = this.state;

    const translateX = pan.x;
    const translateY = pan.y;
    const dragStyles = {transform: [{translateX}, {translateY}, {scale}]};

    const applyStyles = [styles.square, dragStyles];

    return (
      <View
        ref={baseView => this.baseView = baseView}
        onLayout={ () => this._onLayout() }
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={applyStyles}
        >
          <Grid pointerEvents={'none'}>
            {this.props.piece.map( (pieceRow, index) =>
              <Row key={index}>
                {pieceRow.map( (letter, index) =>
                  <Col key={index}>
                    { letter ? <GridSquare letter={letter} /> : null }
                  </Col>
                )}
              </Row>
            )}
          </Grid>
        </Animated.View>
      </View>
    );
  }

  _onLayout() {
    // when the piece scales, this is our reference point
    this.baseView.measureInWindow((x, y, width, height) => {
      this.state.baseWidth = width;
      this.state.baseHeight = height;
    });
  }

  _setCurrentSize(currentScale) {
    // use the base piece size and current scale to determine the piece's current size
    this.state.currentHeight = this.state.baseHeight * currentScale.value;
    this.state.currentWidth = this.state.baseWidth * currentScale.value;

    this._setRelativeMiddlePoints();
  }

  _setRelativeMiddlePoints() {
    // for each letter in the piece, the current middle point is saved to an array
    let middlePoints = [];
    this.props.piece.forEach( (row, rowIndex ) => {
      row.forEach( (letter, columnIndex) => {
        if (letter) {
          const x = ((columnIndex) * (this.state.currentWidth / 4)) + (this.state.currentWidth / 8);
          const y = ((rowIndex) * (this.state.currentHeight / 4)) + (this.state.currentHeight / 8);
          middlePoints.push({x, y, rowIndex, columnIndex, letter});
        }
      })
    });
    this.state.relativeMiddlePoints = middlePoints;
  }

  _getLettersBelowPiece(event) {
    // set the x and y coordinates of the piece being dragged
    // locationX and locationY are set based on initial size, so the distances must be scaled
    const elementX = event.nativeEvent.pageX - (event.nativeEvent.locationX * this.state.scale._value);
    const elementY = event.nativeEvent.pageY - (event.nativeEvent.locationY * this.state.scale._value);

    // check beneath all piece squares containing letters
    const squaresBelow = this.state.relativeMiddlePoints.map( (point) => {
      // set the middle point as an absolute board position
      const currentMiddlePointX = elementX + point.x;
      const currentMiddlePointY = elementY + point.y;

      // compare point to row bounds and return row index
      const row = this.props.display.gameBoard.rowBounds.reduce( ( foundRow, rowBound, index ) => {
        if ( currentMiddlePointY > rowBound.minY && currentMiddlePointY < rowBound.maxY) {
          return index;
        } else {
          return foundRow;
        }
      }, -1 );

      // compare point to column bounds and return column index
      const column = this.props.display.gameBoard.columnBounds.reduce( ( foundColumn, columnBound, index) => {
        if ( currentMiddlePointX > columnBound.minX && currentMiddlePointX < columnBound.maxX) {
          return index;
        } else {
          return foundColumn;
        }
      }, -1);

      // confirm that the piece is on the board and grab the letter below
      const onBoard = (row >= 0 && column >= 0);
      const letterBelow = onBoard ? this.props.board.rows[row][column] : null;

      return {...point, letterBelow};
    });

    // console.log("squaresBelow: ", squaresBelow);

    return squaresBelow;

    // if all the squares below are blank, return true
    return squaresBelow.reduce( (canDropStatus, squareBelow) => {
      return (canDropStatus && squareBelow.letterBelow === "");
    }, true);
  }

  _checkDropReducer( canDropStatus, squareBelow) {
    return (canDropStatus && squareBelow.letterBelow === "");
  }

  static _panResponderCaptureTrue() {
    // this could easily be written as anonymous function, but webstorm kept doing annoying highlighting things
    return true;
  }

  _onPanResponderGrant(event, gesture) {
    this.state.dragging = true;
    this.state.pan.setValue({x: 0, y: 0});
    Animated.timing(
      this.state.scale,
      { toValue: 1.33, duration: 200 }
    ).start();
  }

  _onPanResponderRelease(event, gesture) {
    this.state.dragging = false;
    this.state.canDrop = false;
    Animated.timing(this.state.pan, {
      toValue: { x: 0, y: 0 },
      duration: 200
    }).start();
    Animated.timing(
      this.state.scale,
      { toValue: 1, duration: 200 }
    ).start();

    const squaresBelow = this._getLettersBelowPiece(event);
    const canDrop = squaresBelow.reduce(this._checkDropReducer, true);

    console.log('candrop: ', canDrop);
  }

  _onPanResponderMove(event, gestureState) {
    Animated.event([null, {
      dx: this.state.pan.x,
      dy: this.state.pan.y,
    }])(event, gestureState);

    const squaresBelow = this._getLettersBelowPiece(event);
    this.state.canDrop = squaresBelow.reduce(this._checkDropReducer, true);
  }
}

const styles = StyleSheet.create({
  square: {
    width: "100%",
    height: "100%",
  },
});

const mapStateToProps = (state) => {
  return {
    display: state.display,
    board: state.board
  };
};

export default withRouter(connect(mapStateToProps)(GamePiece));