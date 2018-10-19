import React, { Component } from 'react';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import { Text, StyleSheet, View } from "react-native";

import GamePhaseDisplay from "./GamePhaseDisplay";
import GamePieceSection from "./GamePieceSection";

class GameInfoDisplay extends Component {
  render() {
    return(
      <View style={[this.props.style, styles.main]}>
        <View style={[styles.row, {padding: 5}]}>
          <Text>Opponent Pieces:</Text>
          <GamePieceSection pieces={this.props.game.them} allowDrag={false} />
        </View>
        <View style={[styles.row, {padding: 5}]}>
          <GamePhaseDisplay/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
  },
  row: {
    flex: 1
  }
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    game: state.gameData.byID[gameID],
  };
};

export default withRouter(connect(mapStateToProps)(GameInfoDisplay));