import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

class ChallengeInfoDisplay extends Component {
  render() {
    const { history, score, word } = this.props;

    // const drawHistory
    const movesRemaining = 6 - history.length;
    const message = word ? "place a piece" : "spell a word";

    return (
      <View style={[styles.row, this.props.style]}>
        <Text style={{width: '100%'}}>{ movesRemaining } moves remaining</Text>
        <Text style={{width: '100%'}}>{ score } points</Text>
        <Text style={{width: '100%'}}>{ message }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'column'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  equal: {
    flex: 1
  },
  turn: {
    minWidth: 20,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'column',
  },
  score: {
    borderWidth: 2,
    borderColor: 'white',
    flex: 1,
    textAlign: 'center',
  },
  highlight: {
    backgroundColor: 'green',
  }
});

export default ChallengeInfoDisplay;