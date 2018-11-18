import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import { boardStringToArray, calculateLongestWordLength, calculateHighestWordValue, getWordPath } from "../utilities";
import Boggle from '../utilities/boggle-solver';

import DrawBoard from '../components/DrawBoard';
import GameBoardPathCreator from "../components/GameBoardPathCreator";
import {SPACE_CONSUMED, SPACE_EMPTY, SPACE_FILLED} from "../constants";

class GameReview extends Component {
  constructor() {
    super();

    this.state = {
      mostValuableWords: [],
      longestWords: [],
      availableWords: [],
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
        } else {
          return {letter, status: SPACE_FILLED};
        }
      });
    });


    return (
      <View style={styles.mainView}>
        <View style={styles.boardSection}>
          <DrawBoard boardState={displayBoardState} />
          {/*<GameBoardPathCreator squares={game.consumedSquares} boardLocation={display.boardLocation}/>*/}
        </View>
      </View>
    );
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