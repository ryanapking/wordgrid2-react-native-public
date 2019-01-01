import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import Piece from './Piece';
import DrawPieceSection from './DrawPieceSection';

class ChallengePieceSetDisplay extends Component {
  render() {
    const { consumedSquares, pieceSet } = this.props;
    if (!pieceSet) {
      return null;
    }

    const pieceSetArray = Object.keys(pieceSet).map( (key) => pieceSet[key]);

    return (
      <ScrollView style={styles.fullSize} horizontal={true}>
        <View style={styles.pieceSectionContainer}>
          <DrawPieceSection pieces={pieceSetArray} allowDrag={false}/>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  fullSize: {
    width: '100%',
    height: '100%',
  },
  pieceSectionContainer: {
    height: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    aspectRatio: 13,
    backgroundColor: 'green',
  },
  gamePiece: {
    backgroundColor: 'gray',
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1,
  },
});

const mapStateToProps = (state) => {
  const { challenge } = state.challengeData;
  return {
    consumedSquares: challenge.consumedSquares,
    pieceSet: challenge.pieceSet,
  };
};

export default connect(mapStateToProps)(ChallengePieceSetDisplay);