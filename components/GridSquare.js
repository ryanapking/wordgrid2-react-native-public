import React, { Component } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated } from 'react-native';

export default class GridSquare extends Component {

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

    let squareStyles = letter ? styles.filledSquare : styles.emptySquare;

    return (
      <Text style={[styles.base, squareStyles]}>{letter}</Text>
    );

    return (
      <Animated.View {...this.panResponder.panHandlers} style={[panStyle, styles.base, squareStyles]}>
        <Text>{letter}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',

  },
  filledSquare: {
    backgroundColor: "#ffd27b",
  },
  emptySquare: {
    backgroundColor: "#9c9c9c"
  }
})

