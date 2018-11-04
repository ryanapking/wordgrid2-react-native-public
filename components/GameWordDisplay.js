import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Container } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import { playWord, setBoardRows, addOpponentPiece } from '../ducks/gameData';
import { calculateWordValue, calculateMoveRating, generateLocalPiece, consumedSquaresToWordPath } from "../utilities";
import english from '../utilities/english';
import DrawMoveRating from './DrawMoveRating';

class GameWordDisplay extends Component {
  render() {
    const { game } = this.props;
    const displayWord = this.props.game.consumedSquares.reduce( (word, square) => word + square.letter, "");
    const longEnough = (displayWord.length >= 4);
    const startMessage = "Drag to spell a word";

    let button = null;

    if (longEnough) {
      button = (
        <Button block info onPress={() => this.validateThenPlayWord()}>
          <Text>Play word for {calculateWordValue(displayWord)} points</Text>
        </Button>
      );
    }

    const rating = calculateMoveRating(displayWord, game.availableWords.longest, game.availableWords.mostValuable);
    const stars = <DrawMoveRating rating={rating} />;

    return (
      <Container style={this.props.style}>
        <Text style={{padding: 20, textAlign: 'center'}}>{displayWord ? displayWord : startMessage}</Text>
        {button}
        {stars}
      </Container>
    );
  }

  validateThenPlayWord() {
    const word = this.props.game.consumedSquares.reduce( (word, square) => word + square.letter, "");
    const wordExists = english.contains(word);

    if (wordExists) {
      this.playValidatedWord(word);
    }
  }

  playValidatedWord(word) {
    console.log('word validated...', this.props.game);
    const wordValue = calculateWordValue(word);
    const newScore = this.props.game.myScore + wordValue;
    const wordPath = consumedSquaresToWordPath(this.props.game.consumedSquares);
    this.props.playWord(this.props.gameID, this.props.uid, word, wordPath, wordValue, newScore);

    const newRows = this.props.game.rows.map( (row, rowIndex ) => {
      return row.map( (letter, columnIndex) => {
        const letterPlayed = this.props.game.consumedSquares.reduce( (found, square) => found || (square.rowIndex === rowIndex && square.columnIndex === columnIndex), false );
        return letterPlayed ? "" : letter;
      });
    });

    this.props.setBoardRows(this.props.gameID, newRows);

    // if the opponent is missing a piece, we need to set their next one

    // filter out empty pieces to see if we need to create a new one
    // ... because this is the way i previously decided to deal with these
    const pieces = this.props.game.them.filter( (piece) => piece.length);

    // add a new piece if needed
    if (pieces.length < 3) {
      const newPiece = generateLocalPiece(word.length);
      const newPieces = [...pieces, newPiece];
      this.props.addOpponentPiece(this.props.gameID, newPieces);
    }
  }

}

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    uid: state.user.uid,
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