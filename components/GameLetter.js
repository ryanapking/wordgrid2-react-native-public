import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

export default class GameLetter extends Component {
  render() {
    return (
      <Text style={[styles.letter, this.props.dragStyles]}>
        {this.props.letter}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  letter: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    // borderRadius: 5,
    borderColor: 'white',
    backgroundColor: "#ffd27b",
  },
  full: {
    width: '100%',
    height: '100%'
  }
});