import React, { Component } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated } from 'react-native';

export default class GridSquare extends Component {
  render() {
    const { letter } = this.props;

    let squareStyles = letter ? styles.filledSquare : styles.emptySquare;

    return (
      <Text style={[styles.base, squareStyles]}>{letter}</Text>
    );
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
  }
})

