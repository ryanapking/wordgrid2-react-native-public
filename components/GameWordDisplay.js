import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Button, Container, Spinner} from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import firebase from "react-native-firebase";

import { playValidatedWord } from '../ducks/gameData';
import { calculateWordValue } from "../utilities";

class GameWordDisplay extends Component {
  constructor() {
    super();

    this.state = {
      validatingWord: false,
      wordValid: false
    };

    this.playWord = this.playWord.bind(this);
  }

  render() {
    const displayWord = this.props.consumedSquares.reduce( (word, square) => word + square.letter, "");
    const longEnough = (displayWord.length >= 4);

    let button = null;

    if (longEnough) {
      button = (
        <Button full light onPress={() => this.playWord()}>
          <Text>Submit Your Word for {calculateWordValue(displayWord)} points</Text>
        </Button>
      );
    }

    if (this.state.validatingWord) {
      button = (
        <Button full info disabled>
          <Spinner color='blue' />
        </Button>
      );
    }

    return (
      <View>
        <Text style={{padding: 20, textAlign: 'center'}}>{displayWord}</Text>
        {button}
      </View>
    );
  }

  playWord() {
    // validate the word, update data if valid

    const word = this.props.consumedSquares.reduce( (word, square) => word + square.letter, "");

    this.setState({
      validatingWord: true
    });

    firebase.firestore().collection('dictionary').doc(word).get()
      .then((doc) => {

        this.setState({
          validatingWord: false
        });

        console.log(`${word} exists? ${doc.exists}`);

        if (doc.exists) {
          this.props.playValidatedWord(this.props.consumedSquares, this.props.rows, this.props.gameID);
        }

      })
      .catch((e) => {
        console.log("error fetching doc:", e);
        this.setState({
          validatingWord: false
        });
      });

  }

}

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    consumedSquares: state.gameData.byID[gameID].consumedSquares,
    rows: state.gameData.byID[gameID].rows,
    wordValue: state.gameData.byID[gameID].wordValue
  }
};

const mapDispatchToProps = {
  playValidatedWord
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameWordDisplay));