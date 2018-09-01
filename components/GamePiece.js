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
        Animated.spring(
          this.state.scale,
          { toValue: 1.33, friction: 3 }
        ).start();
      },

      onPanResponderMove: (e, gestureState) => {
        // looks below the mouse pointer
        // console.log(e.nativeEvent.pageX, e.nativeEvent.pageY);
        // const row = this.props.display.gameBoard.rowBounds.reduce( ( foundRow, val, index ) => {
        //   if ( e.nativeEvent.pageY > val.minY && e.nativeEvent.pageY < val.maxY) {
        //     return index;
        //   } else {
        //     return foundRow;
        //   }
        // }, -1 );
        //
        // const column = this.props.display.gameBoard.columnBounds.reduce( ( foundColumn, val, index) => {
        //   if ( e.nativeEvent.pageX > val.minX && e.nativeEvent.pageX < val.maxX) {
        //     return index;
        //   } else {
        //     return foundColumn;
        //   }
        // }, -1);
        //
        // if ( row >= 0 && column >= 0) {
        //   console.log(this.props.board.rows[row][column]);
        // }

        // console.log("e", e.nativeEvent.locationX, e.nativeEvent.locationY, e.nativeEvent.target);
        // console.log(this.state.scale._value);

        // const currentWidth = this.state.baseWidth * this.state.scale._value;
        // const currentHeight = this.state.baseHeight * this.state.scale._value;

        console.log(this.state.currentWidth, this.state.currentHeight);



        const minY = this.props.display.gameBoard.y;
        const maxY = this.props.display.gameBoard.y + this.props.display.gameBoard.height;
        if (gestureState.moveY >= minY && gestureState.moveY <= maxY) {
          // console.log("hovering");
        }
        Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gestureState);
      },

      onPanResponderRelease: (e, gesture) => {
        // console.log("release x: ", gesture.moveX, "y: ", gesture.moveY);
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 5
        }).start();
        Animated.spring(
          this.state.scale,
          { toValue: 1, friction: 3 }
        ).start();
      },

    });
  }

  render() {
    const { pan, scale } = this.state;

    // console.log("board location: ", this.props.display.gameBoard);

    // console.log("pan: ", pan.x, pan.y);
    // console.log("scale: ", scale);
    // console.log("letter: ", letter);

    // console.log("here here");
    // console.log(this.panResponder.panHandlers);

    const translateX = pan.x;
    const translateY = pan.y;
    let dragStyles = {transform: [{translateX}, {translateY}, {scale}]};

    // console.log("dragstyles: ", dragStyles);

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
                {pieceRow.map( (letter, index) => {
                  if (letter) {
                    return (
                      <Col key={index}>
                        <GridSquare letter={letter} />
                      </Col>
                    );
                  } else {
                    return (
                      <Col key={index}></Col>
                    )
                  }
                })}
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
      this.state.currentWidth = width * this.state.scale._value;
      this.state.currentHeight = height * this.state.scale._value;
    });

    this._setRelativeMiddlePoints();
  }

  _setCurrentSize(currentScale) {
    this.state.currentHeight = this.state.baseHeight * currentScale.value;
    this.state.currentWidth = this.state.baseWidth * currentScale.value;
  }

  _setRelativeMiddlePoints() {
    const eighth = this.state.currentWidth / 8;
    // this.state.relativeMiddlePoints =
    //   Array(16).fill(1).map( ( val1, rowIndex ) => {
    //     const row =
    //     return {x: 1, y: 1};
    //   });
    console.log(this.state.relativeMiddlePoints);
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