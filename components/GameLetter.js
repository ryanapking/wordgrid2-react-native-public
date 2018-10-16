import React, { Component } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { Container } from 'native-base';

export default class GameLetter extends Component {
  render() {
    if (!this.props.letter) {
      return null;
    }

    const UCLetter = this.props.letter.toUpperCase();

    const textStyles = {
      textAlign: 'center',
      fontSize: this.props.letterHeight ? this.props.letterHeight * .75 : 28,
    };

    return (
      <Container style={[styles.letter, this.props.style]}>
        <Text style={textStyles}>{ UCLetter }</Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  letter: {
    width: "100%",
    height: "100%",
    padding: '5%',
    // borderWidth: 1,
    // borderRadius: 5,
    borderColor: 'white',
    backgroundColor: "#ffd27b",
  },
  full: {
    width: '100%',
    height: '100%'
  }
});