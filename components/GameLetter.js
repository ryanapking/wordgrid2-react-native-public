import React, { Component } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { Icon, Container } from 'native-base';

import LetterImages from '../assets/png-letters';

export default class GameLetter extends Component {
  render() {
    if (!this.props.letter) {
      return null;
    }

    const UCLetter = this.props.letter.toUpperCase();

    return (
      <Container style={[styles.letter, this.props.style]}>
        <Image style={styles.full} source={LetterImages[UCLetter]} />
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