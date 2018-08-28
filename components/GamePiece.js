import React, { Component } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';

import GridSquare from './GridSquare';

export default class GamePiece extends Component {

  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY()
    };
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x:0, y:0 };
    this.state.pan.addListener((value) => this._val = value);

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 5
        }).start();
      }
    });
    // adjusting delta value
    this.state.pan.setValue({ x:0, y:0});
  }

  render() {
    const { letter } = this.props;
    console.log("letter: ", letter);
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    };

    return (
      <Animated.View {...this.panResponder.panHandlers} style={[panStyle, styles.square]}>
        <Grid>
          <Row>
            <Col>
              <GridSquare letter={"p"} />
            </Col>
            <Col>
              <GridSquare letter={"o"} />
            </Col>
            <Col>
              <GridSquare letter={"g"} />
            </Col>
            <Col>
              <GridSquare letter={"s"} />
            </Col>
          </Row>
          <Row />
          <Row />
          <Row />
        </Grid>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  square: {
    width: "100%",
    height: "100%",
    // backgroundColor: "#ffd27b",
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: 'white',
  },
})

