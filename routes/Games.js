import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-native';

import { setCurrentGame } from "../ducks/gameData";

class Games extends Component {
  render() {
    console.log("game data: ", this.props.games);

    return (
      <View>
        <Link to="/">
          <Text>Hello there</Text>
        </Link>
        <Text>broseph</Text>
        { this.props.games.allIDs.map( (id, index) =>
          <Link to={`/game/${id}`} key={index}>
            <Text>{ id }</Text>
          </Link>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    games: state.gameData.games
  };
};

const mapDispatchToProps = {
  setCurrentGame
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Games));