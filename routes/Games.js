import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-native';
import { List, ListItem, Button } from 'native-base';

import { remoteSaveGame } from '../ducks/gameData';
import { generateGame } from "../utilities";

class Games extends Component {
  constructor() {
    super();
    this.createGame = this.createGame.bind(this);
  }
  render() {
    // console.log('game data:', this.props.gameData);
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
    this.props.remoteSaveGame(this.props.uid, generateGame());
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.user.uid,
    gameIDs: state.gameData.allIDs,
    gameData: state.gameData
  };
};

const mapDispatchToProps = {
  remoteSaveGame
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Games));