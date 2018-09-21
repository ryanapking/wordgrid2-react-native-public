import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-native';
import { List, ListItem, Button } from 'native-base';

import { setCurrentGame, createGame } from '../ducks/gameData';

class Games extends Component {
  constructor() {
    super();
    this.createGame = this.createGame.bind(this);
  }
  render() {
    return (
      <View style={{width: '100%'}}>
        <List>
          { this.props.gameIDs.map( (idObject, index) =>
            <ListItem onPress={() => this.props.history.push(`/game/${idObject.id}`)} key={index}>
              <Text>{ idObject.name }</Text>
            </ListItem>
          )}
        </List>
        <Button full info onPress={() => this.createGame()}>
          <Text>Create Game</Text>
        </Button>
      </View>
    );
  }

  createGame() {
    console.log('create game function');
  }
}

const mapStateToProps = (state) => {
  return {
    gameIDs: state.gameData.allIDs
  };
};

const mapDispatchToProps = {
  setCurrentGame,
  createGame
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Games));