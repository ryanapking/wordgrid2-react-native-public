import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Button, Container, Spinner} from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import firebase from "react-native-firebase";

import { playWord, setBoardRows, addOpponentPiece } from '../ducks/gameData';
import { calculateWordValue } from "../utilities";

class GameWordDisplay extends Component {
  constructor() {
    super();

    this.state = {
      validatingWord: false,
      wordValid: false
    };

    this.validateThenPlayWord = this.validateThenPlayWord.bind(this);
  }

  render() {
    const displayWord = this.props.game.consumedSquares.reduce( (word, square) => word + square.letter, "");
    const longEnough = (displayWord.length >= 4);

    let button = null;

    if (longEnough) {
      button = (
        <Button full light onPress={() => this.validateThenPlayWord()}>
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

  validateThenPlayWord() {
    // validate the word, update data if valid

    const word = this.props.game.consumedSquares.reduce( (word, square) => word + square.letter, "");

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
          this.playValidatedWord(word);
        }

      })
      .catch((e) => {
        console.log("error fetching doc:", e);
        this.setState({
          validatingWord: false
        });
      });

  }

  playValidatedWord(word) {
    console.log('word validated...', this.props.game);
    this.props.playWord(this.props.gameID, word, calculateWordValue(word));

    const newRows = this.props.game.rows.map( (row, rowIndex ) => {
      return row.map( (letter, columnIndex) => {
        const letterPlayed = this.props.game.consumedSquares.reduce( (found, square) => found || (square.rowIndex === rowIndex && square.columnIndex === columnIndex), false );
        return letterPlayed ? "" : letter;
      });
    });

    this.props.setBoardRows(this.props.gameID, newRows);

    console.log('game state:', this.props.game);
  }

}

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
  }
};

const mapDispatchToProps = {
  playWord,
  setBoardRows,
  addOpponentPiece
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameWordDisplay));