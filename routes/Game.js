import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Button, Container, Spinner} from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import Boggle from '../utilities/boggle-solver';
import GameInfoDisplay from '../components/GameInfoDisplay';
import GameBoard from '../components/GameBoard';
import GameInteraction from '../components/GameInteraction';
import GameMoveAnimation from '../components/GameMoveAnimation';
import GameOverlay from '../components/GameOverlay';
import { setAvailableWordsData } from "../ducks/gameData";
import { calculateHighestWordValue, calculateLongestWordLength } from "../utilities";

import { checkPieceFit } from "../utilities";
import DrawPieceSection from "../components/DrawPieceSection";
import GameWordDisplay from "../components/GameWordDisplay";

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
    //     calculateHighPointWord(words);
    //     calculateLongestWord(words);
    //
    //     console.log(words.length + ' words');
    //     console.log(words.join(', '));
    //   });
    // });

    const currentBoardString = this.props.game.history.slice(-1)[0].b;
    let boggle = new Boggle(currentBoardString);

    boggle.solve( (words) => {
      const longest = calculateLongestWordLength(words).length;
      const mostValuable = calculateHighestWordValue(words).value;

      this.props.setAvailableWordsData(this.props.gameID, longest, mostValuable, words.length);
    });

  }

  render() {
    const { game } = this.props;

    let overlayZIndex = 0;
    if (game.word && !game.piecePlaced) {
      overlayZIndex = 3;
    }

    if (!this.props.game.animationOver) {
      return (
        <Container style={{}}>
          <GameMoveAnimation />
        </Container>
      );
    } else {
      return (
        <Container>
          <View style={[styles.underlay, {zIndex: 2}]}>
            <GameInfoDisplay style={styles.info} gameID={this.props.gameID}/>
            <GameBoard style={styles.board}/>
            <GameInteraction style={styles.interaction} gameID={this.props.gameID}/>
          </View>
          <GameOverlay style={{zIndex: overlayZIndex}} pointerEvents={'none'}/>
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
  underlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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

const mapDispatchToProps = {
  setAvailableWordsData
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));