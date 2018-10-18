import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import GamePiece from './GamePiece';

class GamePieceSection extends Component {
  render() {
    return (
      <Container style={[this.props.style, styles.container]}>
        <Container style={styles.gamePieceContainer}>
          <GamePiece piece={this.props.pieces[0]} pieceIndex={0} style={styles.gamePiece}/>
        </Container>
        <Container style={styles.gamePieceContainer}>
          <GamePiece piece={this.props.pieces[1]} pieceIndex={1} style={styles.gamePiece}/>
        </Container>
        <Container style={styles.gamePieceContainer}>
          <GamePiece piece={this.props.pieces[2]} pieceIndex={2} style={styles.gamePiece}/>
        </Container>
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
  },
  gamePiece: {
    backgroundColor: 'gray',
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1,
  }
});

export default withRouter(GamePieceSection);