import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import { boardStringToArray } from "../utilities";

import DrawBoard from '../components/DrawBoard';
import {SPACE_CONSUMED, SPACE_EMPTY, SPACE_FILLED} from "../constants";

class GameReview extends Component {
  constructor() {
    super();

    this.state = {
      mostValuableWords: [],
      longestWords: [],
      availableWords: [],
    };

    this._getReviewResults();
  }

  render() {
    const { moveIndex } = this.props.match.params;
    const { game } = this.props;
    const boardString = game.history[moveIndex].b;
    const boardState = boardStringToArray(boardString);
    console.log('board state:', boardState);
    console.log('game', game);
    console.log('move index', moveIndex);
    console.log('board state', boardState);


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
        </View>
      </View>
    );
  }

  _getReviewResults() {

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