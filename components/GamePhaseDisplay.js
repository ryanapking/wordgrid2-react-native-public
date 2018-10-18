import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

class GamePhaseDisplay extends Component {
  render() {
    const wordPlayed = !!this.props.game.word;

    let playStyles = styles.disabled;
    let placeStyles = styles.disabled;

    if (!wordPlayed) {
      playStyles = styles.enabled;
    } else if (!this.props.game.piecePlaced) {
      placeStyles = styles.enabled;
    }

    return (
      <Container>
        <Container style={[styles.row, playStyles]}>
          <Text>
            Play Word
          </Text>
        </Container>
        <Container style={[styles.row, placeStyles]}>
          <Text>
            Place Piece
          </Text>
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabled: {
    backgroundColor: 'lightgray'
  },
  enabled: {
    backgroundColor: '#53adff'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    game: state.gameData.byID[ownProps.match.params.gameID]
  };
};

export default withRouter(connect(mapStateToProps)(GamePhaseDisplay));