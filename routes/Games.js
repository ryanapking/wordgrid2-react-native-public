import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-native';
import { List, ListItem } from 'native-base';

import { setCurrentGame } from "../ducks/gameData";

class Games extends Component {
  render() {
    return (
      <List>
        { this.props.games.allIDs.map( (idObject, index) =>
          <ListItem onPress={() => this.props.history.push(`/game/${idObject.id}`)} key={index}>
            <Text>{ idObject.name }</Text>
          </ListItem>
        )}
      </List>
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