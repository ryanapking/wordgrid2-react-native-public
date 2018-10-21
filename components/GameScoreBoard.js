import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import { calculateScore } from "../utilities/functions/dataConversions";

class GameScoreBoard extends Component {
  render() {

    const topLabel = (this.props.p1 === this.props.uid) ? "You: " : "Them: ";
    const bottomLabel = (this.props.p2 === this.props.uid) ? "You: " : "Them: ";

    const totalScores = this.props.scoreBoard.reduce( (totals, turn) => {
      const p1 = totals.p1 + turn.p1;
      const p2 = totals.p2 + turn.p2;
      return {p1, p2};
    }, { p1: 0, p2: 0});

    return (
      <Container style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.equal}>{ topLabel }</Text>
          <Text style={styles.equal}>{ bottomLabel }</Text>
        </View>
        {this.props.scoreBoard.map( (turn, index) =>
          <View key={index} style={styles.turn}>
            <Text style={styles.score}>{turn.p1}</Text>
            <Text style={styles.score}>{turn.p2}</Text>
          </View>
        )}
        <View style={styles.turn}>
          <Text style={styles.score}>{ totalScores.p1 }</Text>
          <Text style={styles.score}>{ totalScores.p2 }</Text>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row'
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
  }
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  const game = state.gameData.byID[gameID];
  return {
    p1: game.p1,
    p2: game.p2,
    scoreBoard: game.scoreBoard,
    history: game.history,
    uid: state.user.uid
  };
};

export default withRouter(connect(mapStateToProps)(GameScoreBoard));