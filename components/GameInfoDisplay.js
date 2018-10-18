import React, { Component } from 'react';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import { Col, Row } from "react-native-easy-grid";
import { Text } from "react-native";

import GamePhaseDisplay from "./GamePhaseDisplay";
import GamePieceSection from "./GamePieceSection";

class GameInfoDisplay extends Component {
  render() {
    return(
      <Row>
        <Col>
          <GamePhaseDisplay/>
        </Col>
        <Col>
          <Text>Opponent:</Text>
          <GamePieceSection pieces={this.props.game.them} allowDrag={false} />
          <Text>Points: {this.props.game.theirScore}</Text>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    game: state.gameData.byID[gameID],
  };
};

export default withRouter(connect(mapStateToProps)(GameInfoDisplay));