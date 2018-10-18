import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Row, Col, Grid } from 'react-native-easy-grid';

import Boggle from '../utilities/boggle-solver';
import GameInfoDisplay from '../components/GameInfoDisplay';
import GameBoard from '../components/GameBoard';
import GameInteraction from '../components/GameInteraction';

import { checkPieceFit } from "../utilities";

class Game extends Component {

  componentDidMount() {
    // console.log('game.js component mounted');
    // console.log('game:', this.props.game);

    // checkPieceFit(this.props.game.me, this.props.game.rows);
    // gameOverCheck(this.props.game);

    const lastItemIndex = this.props.game.history.length - 1;
    const boardState = this.props.game.history[lastItemIndex].b;
    let boggle = new Boggle(boardState);
    boggle.solve( (words) => {
      boggle.print();

      console.log(words.length + ' words');
      console.log(words.join(', '));
    });
  }

  render() {
    return (
      <Grid>
        <Col>
          <Row size={15}>
            <GameInfoDisplay gameID={this.props.gameID}/>
          </Row>
          <Row size={60}>
            <GameBoard />
          </Row>
          <Row size={25}>
            <GameInteraction gameID={this.props.gameID}/>
          </Row>
        </Col>
      </Grid>
    );
  }

  componentDidUpdate() {
    if ( this.props.uid !== this.props.game.turn ) {
      this.props.history.push(`/games`);
      console.log("opponent's move. redirecting...");
    }
  }

}

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
    uid: state.user.uid
  };
};

export default withRouter(connect(mapStateToProps)(Game));