import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

class GamePhaseDisplay extends Component {
  render() {
    const wordPlayed = !!this.props.game.word;

    let playDisabled = false;
    let placeDisabled = false;

    if (!wordPlayed) {
      placeDisabled = true;
    } else if (!this.props.game.piecePlaced) {
      playDisabled = true;
    } else if (this.props.game.piecePlaced) {
      playDisabled = true;
      placeDisabled = true;
    }

    return (
      <View >
        <Button full disabled={playDisabled}>
          <Text>Play Word</Text>
        </Button>
        <Button full disabled={placeDisabled}>
          <Text>Place Piece</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    game: state.gameData.byID[ownProps.match.params.gameID]
  };
};

export default withRouter(connect(mapStateToProps)(GamePhaseDisplay));