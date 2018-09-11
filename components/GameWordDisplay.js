import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import { playWord } from '../ducks/gameData';

class GameWordDisplay extends Component {
  render() {
    const displayWord = this.props.consumedSquares.reduce( (word, square) => word + square.letter, "");
    const longEnough = (displayWord.length >= 4);
    return (
      <View>
        <Text style={{padding: 20, textAlign: 'center'}}>{displayWord}</Text>
        { longEnough ?
          <Button full light onPress={() => this.playWord()}>
            <Text>Submit Your Word</Text>
          </Button>
          : null
        }
      </View>
    );
  }

  playWord() {
    this.props.playWord(this.props.consumedSquares, this.props.rows, this.props.gameID);
  }
}

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    consumedSquares: state.gameData.byID[gameID].consumedSquares,
    rows: state.gameData.byID[gameID].rows,
  }
};

const mapDispatchToProps = {
  playWord
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameWordDisplay));