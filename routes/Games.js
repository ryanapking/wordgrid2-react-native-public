import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-native';
import { List, ListItem, Button } from 'native-base';
import firebase from "react-native-firebase";

import {joinRemoteGame, remoteSaveGame} from '../ducks/gameData';
import {generateGame} from "../utilities";

class Games extends Component {
  constructor() {
    super();
    this.joinRemoteGame = this.joinRemoteGame.bind(this);
    this.createRemoteGame = this.createRemoteGame.bind(this);
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

        <Button full info onPress={() => this.joinRemoteGame()}>
          <Text>New Game</Text>
        </Button>
      </View>
    );
  }

  joinRemoteGame() {

    // if the join game fails, a new game is created instead

    const userID = this.props.uid;
    const gamesCollectionRef = firebase.firestore().collection('games');
    const userDocRef = firebase.firestore().collection('users').doc(userID);

    // query to find a game waiting for a partner
    return gamesCollectionRef
      .where( "t", "==", "p2" )
      .where( "p2", "==", null )
      .limit(1)
      .get()
      .then( (games) => {

        console.log('games', games);

        // game found
        if (games.docs.length > 0) {

          const gameDoc = games.docs[0];
          const joinGameID = { id: gameDoc.id, name: gameDoc.id };
          const joinGameDocRef = gamesCollectionRef.doc(gameDoc.id);

          // inequality queries don't exist in firestore
          // if we happened to grab our own game, then we are out of luck
          if (gameDoc.data().p1 === userID) {
            console.log('we grabbed our own game! creating a new one...');
            this.createRemoteGame();
            return;
          }

          // try to claim the game in firebase
          firebase.firestore().runTransaction( (transaction) => {
            return transaction.get(userDocRef).then( (userDoc) => {

              if (!userDoc.exists) {
                transaction.set(userDocRef, {
                  games: [joinGameID]
                });
              } else {
                const currentUserGames = userDoc.data().games ? userDoc.data().games : [];
                transaction.update(userDocRef, {
                  games: [ ...currentUserGames, joinGameID ]
                });
              }
              transaction.update(joinGameDocRef, {
                t: userID,
                p2: userID
              });

            }).then( () => {
              console.log('join game success');
            }).catch( (err) => {
              console.log('failed to join game. creating a new one...');
              console.log('just in case, printing error:', err);
              this.createRemoteGame();
            });
          });

        } else {
          console.log('found no game to join. creating a new one...')
          this.createRemoteGame();
        }
      })
      .catch( (err) => {
        // query failed
        // (failure is not the same as no results. probably connection issues)
        console.log('err', err);
      });

  }

  createRemoteGame() {

    const userID = this.props.uid;
    const newGameData = generateGame(userID);
    const userDocRef = firebase.firestore().collection('users').doc(userID);
    const newGameDocRef = firebase.firestore().collection('games').doc();
    const newGameID = { id: newGameDocRef.id, name: newGameDocRef.id };

    return firebase.firestore().runTransaction( (transaction) => {

      return transaction.get(userDocRef).then( (userDoc) => {

        if (!userDoc.exists) {
          transaction.set(userDocRef, {
            games: [newGameID]
          });
        } else {
          const currentUserGames = userDoc.data().games ? userDoc.data().games : [];
          transaction.update(userDocRef, {
            games: [ ...currentUserGames, newGameID ]
          });
        }

        transaction.set(newGameDocRef, newGameData );

        console.log('gameDocRef:', newGameDocRef);

      });

    }).then( () => {
      console.log('sweet game save successsssss');
    }).catch( (err) => {
      console.log(err);
    });

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
  joinRemoteGame
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Games));