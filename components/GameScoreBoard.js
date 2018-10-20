import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import { getScoreBoard } from "../utilities";

class GameScoreBoard extends Component {
  render() {
    const scoreBoard = getScoreBoard(this.props.game);

    return (
      <Container style={styles.row}>
        {scoreBoard.map( (inning, index) =>
          <View key={index} style={styles.inning}>
            <Text>{inning.p1}</Text>
            <Text>{inning.p2}</Text>
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  inning: {
    minWidth: 25,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: 'black',
  }
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    game: state.gameData.byID[gameID],
  };
};

export default withRouter(connect(mapStateToProps)(GameScoreBoard));