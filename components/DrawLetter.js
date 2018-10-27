import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Container } from 'native-base';
import PropTypes from 'prop-types';

export default class DrawLetter extends Component {
  render() {
    const { letter, letterSize } = this.props;

    if (!letter) {
      return null;
    }

    const textStyles = {
      textAlign: 'center',
      fontSize: letterSize ? letterSize * .75 : 28,
    };

    const borderSize = {
      borderWidth: letterSize ? letterSize * .015 : 1,
    };

    return (
      <Container style={[borderSize, styles.letter, this.props.style]}>
        <Text style={textStyles}>{ letter.toUpperCase() }</Text>
      </Container>
    );
  }

  static propTypes = {
    letter: PropTypes.string,
    letterSize: PropTypes.number,
  }
}

const styles = StyleSheet.create({
  letter: {
    width: "100%",
    height: "100%",
    padding: '5%',
    borderColor: 'white',
    backgroundColor: "#ffd27b",
  },
  full: {
    width: '100%',
    height: '100%'
  }
});