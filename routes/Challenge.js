import React, { Component } from 'react';
import {Text, StyleSheet, View} from 'react-native';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import { Container } from "native-base";

import GameBoard from '../components/GameBoard';
import { startChallenge, consumeSquare, removeSquare, clearConsumedSquares } from "../ducks/challengeData";

class Challenge extends Component {
  componentDidMount() {
    this.props.startChallenge();
  }

  render() {
    const { challenge } = this.props.challengeData;

    if (challenge) {
      return (
        <Container>
          <View style={styles.info}></View>
          <GameBoard
            style={styles.board}
            word={challenge.word}
            rows={challenge.rows}
            consumedSquares={challenge.consumedSquares}
            consumeSquare={(square) => this.props.consumeSquare(square)}
            removeSquare={() => this.props.removeSquare()}
            clearConsumedSquares={() => this.props.clearConsumedSquares()}
          />
          <View style={styles.interaction}></View>
        </Container>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  underlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 4,
  },
  board: {
    flex: 14,
  },
  interaction: {
    flex: 5,
  }
});

const mapStateToProps = (state) => {
  return {
    challengeData: state.challengeData
  };
};

const mapDispatchToProps = {
  startChallenge,
  consumeSquare,
  removeSquare,
  clearConsumedSquares,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Challenge));