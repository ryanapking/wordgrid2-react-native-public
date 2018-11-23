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

class GameReview extends Component {
  constructor() {
    super();

    this.state = {
      mostValuableWords: [],
      longestWords: [],
      availableWords: [],
      boardLocation: {},
      displayPath: [],
    };

  }

  componentDidMount() {
    const { moveIndex } = this.props.match.params;
    const { game } = this.props;
    const boardString = game.history[moveIndex].b;
    const boardState = boardStringToArray(boardString);

    this._getReviewResults(boardString, boardState);
  }

  render() {
    const { moveIndex } = this.props.match.params;
    const { game } = this.props;
    const boardString = game.history[moveIndex].b;
    const boardState = boardStringToArray(boardString);
    // console.log('board state:', boardState);
    // console.log('game', game);
    // console.log('move index', moveIndex);
    // console.log('board state', boardState);

    console.log('game review state:', this.state);

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
        <View style={styles.boardSection} ref={gameBoard => this.gameBoard = gameBoard} onLayout={() => this._onLayout()}>
          <DrawBoard boardState={displayBoardState} />
          <GameBoardPathCreator squares={this.state.displayPath} boardLocation={this.state.boardLocation}/>
        </View>
        <ScrollView>
          <List>
            <ListItem itemDivider>
              <Text>Most Valuable Words:</Text>
            </ListItem>
            {this.state.mostValuableWords.map( (word, index) =>
              <TouchableWithoutFeedback key={index} onPressIn={() => this._setDisplayPath(word.path)} onPressOut={() => this._clearDisplayPath()}>
                <ListItem>
                  <Text>{word.word}</Text>
                </ListItem>
              </TouchableWithoutFeedback>
            )}
            <ListItem itemDivider>
              <Text>Longest Words:</Text>
            </ListItem>
            {this.state.longestWords.map( (word, index) =>
              <TouchableWithoutFeedback key={index} onPressIn={() => this._setDisplayPath(word.path)} onPressOut={() => this._clearDisplayPath()}>
                <ListItem>
                  <Text>{word.word}</Text>
                </ListItem>
              </TouchableWithoutFeedback>
            )}
          </List>
        </ScrollView>
      </View>
    );
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

  _checkSquareAvailable(square) {
    return this.state.displayPath.reduce( (squareAvailable, pathSquare) => {
      if (square.rowIndex === pathSquare.rowIndex && square.columnIndex === pathSquare.columnIndex) {
        return false;
      } else {
        return squareAvailable;
      }
    }, true);
  }

  _getReviewResults(boardString, boardState) {
    let boggle = new Boggle(boardString);
    boggle.solve( (words) => {
      const longest = calculateLongestWordLength(words);
      const mostValuable = calculateHighestWordValue(words);

      let longestWords = [];
      longest.words.forEach( (word) => {
        const wordPath = getWordPath(word, boardState);
        longestWords.push({word, path: wordPath});
      });

      let mostValuableWords = [];
      mostValuable.words.forEach( (word) => {
        const wordPath = getWordPath(word, boardState);
        mostValuableWords.push({word, path: wordPath});
      });

      this.setState({
        availableWords: words,
        longestWords,
        mostValuableWords,
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
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    game: state.gameData.byID[gameID],
    uid: state.user.uid
  };
};

export default withRouter(connect(mapStateToProps)(GameReview));