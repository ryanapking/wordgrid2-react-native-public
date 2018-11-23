import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { List, ListItem } from 'native-base';

import { boardStringToArray, calculateLongestWordLength, calculateHighestWordValue, getWordPath } from "../utilities";
import Boggle from '../utilities/boggle-solver';

import DrawBoard from '../components/DrawBoard';
import GameBoardPathCreator from "../components/GameBoardPathCreator";
import { SPACE_CONSUMED, SPACE_EMPTY, SPACE_FILLED } from "../constants";
import { wordPathStringToArray, calculateWordValue } from "../utilities";

class GameReview extends Component {
  constructor() {
    super();

    this.state = {
      moveIndex: 1,
      mostValuableWords: [],
      mostValuablePoints: null,
      longestWords: [],
      longestLetterCount: null,
      availableWords: [],
      boardLocation: {},
      displayPath: [],
      playerMovePath: [],
      playerMoveWord: null,
      allAvailableWords: [],
    };
  }

  componentDidMount() {
    this._getReviewResults(this.state.moveIndex);
  }

  render() {
    const { moveIndex } = this.state;
    const { game } = this.props;
    const move = game.history[moveIndex];
    const boardString = game.history[moveIndex-1].b;
    const boardState = boardStringToArray(boardString);

    const displayBoardState = boardState.map( (row, rowIndex) => {
      return row.map( (letter, columnIndex) => {
        if (!letter) {
          return {letter, status: SPACE_EMPTY};
        } else if (!this._checkSquareAvailable({rowIndex, columnIndex})) {
          return {letter, status: SPACE_CONSUMED};
        } else {
          return {letter, status: SPACE_FILLED};
        }
      });
    });


    return (
      <View style={styles.mainView}>
        <View style={styles.changeMovesSection}>
          <Text style={styles.changeMove} onPress={() => this._changeMoveIndex(moveIndex - 1)}>Prev</Text>
          <Text style={styles.changeMove} onPress={() => this._changeMoveIndex(moveIndex + 1)}>Next</Text>
        </View>
        <View style={styles.boardSection} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this._onLayout()}>
          <DrawBoard boardState={displayBoardState} />
          <GameBoardPathCreator squares={this.state.displayPath} boardLocation={this.state.boardLocation}/>
        </View>
        <ScrollView>
          <List>

            <ListItem itemDivider style={styles.spaceBetween}>
              <Text>Player Move:</Text>
              <Text>{ move.wv } points</Text>
            </ListItem>
            <TouchableWithoutFeedback onPressIn={() => this._setDisplayPath(this.state.playerMovePath)} onPressOut={() => this._clearDisplayPath()}>
              <ListItem>
                <Text>{ move.w.toUpperCase() }</Text>
              </ListItem>
            </TouchableWithoutFeedback>

            <ListItem itemDivider style={styles.spaceBetween}>
              <Text>Most Valuable Words:</Text>
              <Text>{ this.state.mostValuablePoints } points</Text>
            </ListItem>
            {this.state.mostValuableWords.map( (word, index) =>
              <TouchableWithoutFeedback key={index} onPressIn={() => this._findAndSetDisplayPath(word, boardState)} onPressOut={() => this._clearDisplayPath()}>
                <ListItem>
                  <Text>{word}</Text>
                </ListItem>
              </TouchableWithoutFeedback>
            )}

            <ListItem itemDivider style={styles.spaceBetween}>
              <Text>Longest Words:</Text>
              <Text>{ this.state.longestLetterCount } letters</Text>
            </ListItem>
            {this.state.longestWords.map( (word, index) =>
              <TouchableWithoutFeedback key={index} onPressIn={() => this._findAndSetDisplayPath(word, boardState)} onPressOut={() => this._clearDisplayPath()}>
                <ListItem>
                  <Text>{word}</Text>
                </ListItem>
              </TouchableWithoutFeedback>
            )}

            <ListItem itemDivider style={styles.spaceBetween}>
              <Text>All Available Words:</Text>
              <Text>{ this.state.availableWords.length } words</Text>
            </ListItem>
            {this.state.availableWords.map( (word, index) =>
              <TouchableWithoutFeedback key={index} onPressIn={() => this._findAndSetDisplayPath(word.word, boardState)} onPressOut={() => this._clearDisplayPath()}>
                <ListItem style={styles.spaceBetween}>
                  <Text>{ word.word }</Text>
                  <Text>{ word.value } points</Text>
                </ListItem>
              </TouchableWithoutFeedback>
            )}

          </List>
        </ScrollView>
      </View>
    );
  }

  _changeMoveIndex(moveIndex) {
    this.setState({
      moveIndex,
    });

    this._getReviewResults(moveIndex);
  }

  _clearDisplayPath() {
    this.setState({
      displayPath: []
    });
  }

  _setDisplayPath(wordPath) {
    this.setState({
      displayPath: wordPath
    });
  }

  _findAndSetDisplayPath(word, boardState) {
    const wordPath = getWordPath(word, boardState);
    this._setDisplayPath(wordPath);
  }

  _checkSquareAvailable(square) {
    return this.state.displayPath.reduce( (squareAvailable, pathSquare) => {
      if (square.rowIndex === pathSquare.rowIndex && square.columnIndex === pathSquare.columnIndex) {
        return false;
      } else {
        return squareAvailable;
      }
    }, true);
  }

  _getReviewResults(moveIndex) {
    const { game } = this.props;
    const move = game.history[moveIndex];
    const playerMovePath = wordPathStringToArray(move.wp);
    const boardString = game.history[moveIndex - 1].b;
    const boardState = boardStringToArray(boardString);

    let boggle = new Boggle(boardString);
    boggle.solve( (words) => {
      const longest = calculateLongestWordLength(words);
      const mostValuable = calculateHighestWordValue(words);

      let longestWords = [];
      longest.words.forEach( (word) => {
        longestWords.push(word);
      });

      let mostValuableWords = [];
      mostValuable.words.forEach( (word) => {
        mostValuableWords.push(word);
      });

      const allWordsWithValues = words.reverse().map( (word) => {
        const value = calculateWordValue(word);
        return {word, value};
      });

      this.setState({
        availableWords: allWordsWithValues,
        longestWords,
        longestLetterCount: longest.length,
        mostValuableWords,
        mostValuablePoints: mostValuable.value,
        playerMovePath,
      });
    });
  }

  _onLayout() {
    this.gameBoard.measure((x, y, width, height, pageX, pageY) => {
      console.log('measure:', {x, y, width, height, pageX, pageY});
      this.setState({
        boardLocation: {
          x,
          y,
          width,
          height,
          rowHeight: height / 10,
          columnWidth: width / 10,
        }
      });
    });
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
  },
  boardSection: {
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1,
  },
  changeMovesSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 35,
  },
  spaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeMove: {
    padding: 10
  },
  playerMove: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
    uid: state.user.uid
  };
};

export default withRouter(connect(mapStateToProps)(GameReview));