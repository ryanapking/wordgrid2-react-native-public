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
      baseHeight: 0,
      baseWidth: 0,
      currentHeight: 0,
      currentWidth: 0,
      relativeMiddlePoints: []
    };
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this.state.scale.addListener((value) => this._setCurrentSize(value));

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setValue({x: 0, y: 0});
        Animated.timing(
          this.state.scale,
          { toValue: 1.33, duration: 200 }
        ).start();
      },

      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gestureState);

        const elementX = e.nativeEvent.pageX - (e.nativeEvent.locationX * this.state.scale._value);
        const elementY = e.nativeEvent.pageY - (e.nativeEvent.locationY * this.state.scale._value);

        const squaresBelow = this.state.relativeMiddlePoints.map( (point) => {

          const currentMiddlePointX = elementX + point.x;
          const currentMiddlePointY = elementY + point.y;

          const row = this.props.display.gameBoard.rowBounds.reduce( ( foundRow, rowBound, index ) => {
            if ( currentMiddlePointY > rowBound.minY && currentMiddlePointY < rowBound.maxY) {
              return index;
            } else {
              return foundRow;
            }
          }, -1 );

          const column = this.props.display.gameBoard.columnBounds.reduce( ( foundColumn, columnBound, index) => {
            if ( currentMiddlePointX > columnBound.minX && currentMiddlePointX < columnBound.maxX) {
              return index;
            } else {
              return foundColumn;
            }
          }, -1);

          let letterBelow = null;

          if (row >= 0 && column >= 0) {
            letterBelow = this.props.board.rows[row][column]
          }

          return {...point, letterBelow};
        });

        console.log(squaresBelow);
      },

      onPanResponderRelease: (e, gesture) => {
        // console.log("release x: ", gesture.moveX, "y: ", gesture.moveY);
        Animated.timing(this.state.pan, {
          toValue: { x: 0, y: 0 },
          duration: 200
        }).start();
        Animated.timing(
          this.state.scale,
          { toValue: 1, duration: 200 }
        ).start();
      },

    });
  }

  render() {
    const { pan, scale } = this.state;

    const translateX = pan.x;
    const translateY = pan.y;
    let dragStyles = {transform: [{translateX}, {translateY}, {scale}]};

    return (
      <View
        ref={baseView => this.baseView = baseView}
        onLayout={ () => this._onLayout() }
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[styles.square, dragStyles]}
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
    this.baseView.measureInWindow((x, y, width, height) => {
      this.state.baseWidth = width;
      this.state.baseHeight = height;
    });
  }

  _setCurrentSize(currentScale) {
    this.state.currentHeight = this.state.baseHeight * currentScale.value;
    this.state.currentWidth = this.state.baseWidth * currentScale.value;

    this._setRelativeMiddlePoints();
  }

  _setRelativeMiddlePoints() {
    // console.log(this.state.currentWidth);
    let middlePointsArray = [];
    this.props.piece.forEach( (row, rowIndex ) => {
      row.forEach( (letter, columnIndex) => {
        if (letter) {
          const x = ((columnIndex) * (this.state.currentWidth / 4)) + (this.state.currentWidth / 8);
          const y = ((rowIndex) * (this.state.currentHeight / 4)) + (this.state.currentHeight / 8);
          middlePointsArray.push({x, y, rowIndex, columnIndex, letter});
        }
      })
    });
    this.state.relativeMiddlePoints = middlePointsArray;
    // console.log(this.state.relativeMiddlePoints);
  }
}

const styles = StyleSheet.create({
  square: {
    width: "100%",
    height: "100%",
  },
})

const mapStateToProps = (state) => {
  return {
    display: state.display,
    board: state.board
  }
};

export default withRouter(connect(mapStateToProps)(GamePiece));