import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import Boggle from '../utilities/boggle-solver';
import GameInfoDisplay from '../components/GameInfoDisplay';
import GameBoard from '../components/GameBoard';
import GameInteraction from '../components/GameInteraction';
import GameMoveAnimation from '../components/GameMoveAnimation'

import { checkPieceFit } from "../utilities";

class Game extends Component {

  componentDidMount() {
    // console.log('game.js component mounted');
    // console.log('game:', this.props.game);

    // checkPieceFit(this.props.game.me, this.props.game.rows);
    // gameOverCheck(this.props.game);

    // log all the moves to see how we did
    // this.props.game.history.forEach( (state) => {
    //   console.log('played:', state.w);
    //   let boggle = new Boggle(state.b);
    //   boggle.solve( (words) => {
    //     boggle.print();
    //
    //     console.log(words.length + ' words');
    //     console.log(words.join(', '));
    //   });
    // });

  }

  render() {
    if (!this.props.game.animationOver) {
      return (
        <Container style={{}}>
          <GameMoveAnimation />
        </Container>
      );
    } else {
      return (
        <Container>
          <GameInfoDisplay style={styles.info} gameID={this.props.gameID}/>
          <GameBoard style={styles.board}/>
          <GameInteraction style={styles.interaction} gameID={this.props.gameID}/>
        </Container>
      );
    }

  }

  componentDidUpdate() {
    if ( this.props.uid !== this.props.game.turn ) {
      this.props.history.push(`/games`);
      console.log("opponent's move. redirecting...");
    }
  }

}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  info: {
    flex: 4,
    // backgroundColor: 'blue',
  },
  board: {
    flex: 14,
    // backgroundColor: 'red',
  },
  interaction: {
    flex: 5,
    // backgroundColor: 'green',
  }
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
    uid: state.user.uid
  };
};

export default withRouter(connect(mapStateToProps)(Game));