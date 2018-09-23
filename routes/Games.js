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

    const readyToPlay = Object.keys(this.props.gameData.byID).filter( (gameID) => {
      const game = this.props.gameData.byID[gameID];
      return ( game.turn === null || game.turn === this.props.uid );
    });

    const waitingOnOpponent = Object.keys(this.props.gameData.byID).filter( (gameID) => {
      const game = this.props.gameData.byID[gameID];
      return ( game.turn !== null && game.turn !== this.props.uid );
    });

    return (
      <View style={{width: '100%'}}>
        <List>
          <ListItem itemDivider >
            <Text>Ready to Play:</Text>
          </ListItem>
          { readyToPlay.map( (gameID, index) =>
            <ListItem onPress={() => this.props.history.push(`/game/${gameID}`)} key={index}>
              <Text>{ this.props.gameData.byID[gameID].p1 }</Text>
            </ListItem>
          )}
          <ListItem itemDivider>
            <Text>Opponent's Move:</Text>
          </ListItem>
          { waitingOnOpponent.map( (gameID, index) =>
            <ListItem key={index}>
              <Text>{ this.props.gameData.byID[gameID].p1 }</Text>
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
    this.props.remoteSaveGame(this.props.uid, generateGame(this.props.uid));
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