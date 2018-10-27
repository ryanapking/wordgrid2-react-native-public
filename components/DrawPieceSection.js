import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';

import GamePiece from './GamePiece';

export default class DrawPieceSection extends Component {
  render() {
    const { pieces, allowDrag } = this.props;
    return (
      <Container style={[this.props.style, styles.container]}>
        { pieces.map( (piece, pieceIndex) =>
          <Container style={styles.gamePieceContainer} key={pieceIndex}>
            <GamePiece piece={piece} pieceIndex={pieceIndex} style={styles.gamePiece} allowDrag={allowDrag}/>
          </Container>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  gamePieceContainer: {
    flex: 1,
    margin: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight: '100%',
    maxWidth: '100%',
  },
  gamePiece: {
    backgroundColor: 'gray',
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1,
  }
});