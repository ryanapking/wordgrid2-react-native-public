import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import config from '../utilities/config';
import { getPlayerMoveScores } from "../utilities";

class GameScoreBoard extends Component {
  render() {
    console.log('history:', this.props.game.history);
    console.log('config:', config);
    console.log(getPlayerMoveScores(this.props.game));
    return (
      <Container>
        <Text>GameScoreBoard</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    game: state.gameData.byID[gameID],
  };
};

export default withRouter(connect(mapStateToProps)(GameScoreBoard));