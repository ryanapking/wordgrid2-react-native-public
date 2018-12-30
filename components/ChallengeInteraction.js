import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import { Button, Container } from "native-base";

import DrawPieceSection from "./DrawPieceSection";
import { calculateWordValue } from "../utilities";
import { playWord } from '../ducks/challengeData';

class ChallengeInteraction extends Component {
  render() {
    const { word } = this.props.challenge;
    const wordPlayed = !!word;

    // console.log('challenge data:', this.props.challenge);

    if (!wordPlayed) {
      return this._playWordInteraction();
    } else {
      return this._placePieceInteraction();
    }
  }

  _playWordInteraction() {
    const displayWord = this.props.challenge.consumedSquares.reduce( (word, square) => word + square.letter, "");
    const startMessage = "Drag to spell a word";
    return (
      <Container style={this.props.style}>
        <Container style={[styles.flex]}>
          <DrawPieceSection style={[styles.twoColumns]} pieces={this.props.challenge.pieces} />
          <View style={styles.twoColumns}>
            <Text style={{padding: 20, textAlign: 'center'}}>{displayWord ? displayWord : startMessage}</Text>
            <Button block info onPress={() => this.props.playWord()}>
              <Text>Play word for {calculateWordValue(displayWord)} points</Text>
            </Button>
          </View>
        </Container>
      </Container>
    );
  }

  _placePieceInteraction() {
    return (
      <Container style={this.props.style}>
        <DrawPieceSection pieces={this.props.challenge.pieces} allowDrag />
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  twoColumns: {
    flexBasis: '50%',
    flex: 1,
    maxHeight: '100%',
    maxWidth: '100%',
  },
  confirmMoveSection: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  }
});

const mapStateToProps = (state) => {
  return {
    challenge: state.challengeData.challenge,
  };
};

const mapDispatchToProps = {
  playWord
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChallengeInteraction));