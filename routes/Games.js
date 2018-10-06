import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { List, ListItem } from 'native-base';

import NewGameButton from "../components/NewGameButton";

class Games extends Component {
  render() {

    const readyToPlay = Object.keys(this.props.gameData.byID).filter( (gameID) => {
      const game = this.props.gameData.byID[gameID];
      return ( game.turn === null || game.turn === this.props.userID );
    });

    const waitingOnOpponent = Object.keys(this.props.gameData.byID).filter( (gameID) => {
      const game = this.props.gameData.byID[gameID];
      return ( game.turn !== null && game.turn !== "over" && game.turn !== this.props.userID );
    });

    const over = Object.keys(this.props.gameData.byID).filter( (gameID) => {
      const game = this.props.gameData.byID[gameID];
      return ( game.turn === "over");
    });

    return (
      <View style={{width: '100%'}}>
        <List>
          <ListItem itemDivider >
            <Text>Ready to Play:</Text>
          </ListItem>
          { readyToPlay.map( (gameID, index) =>
            <ListItem onPress={() => this.props.history.push(`/game/${gameID}`)} key={index}>
              <Text>{ this.props.gameData.byID[gameID].opponentName }</Text>
            </ListItem>
          )}
          <ListItem itemDivider>
            <Text>Opponent's Move:</Text>
          </ListItem>
          { waitingOnOpponent.map( (gameID, index) =>
            <ListItem key={index}>
              <Text>{ this.props.gameData.byID[gameID].opponentName }</Text>
            </ListItem>
          )}
        </List>

        <NewGameButton />
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    userID: state.user.uid,
    gameData: state.gameData,
  };
};

export default withRouter(connect(mapStateToProps)(Games));