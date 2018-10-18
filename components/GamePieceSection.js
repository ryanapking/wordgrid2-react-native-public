import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import GamePiece from './GamePiece';

class GamePieceSection extends Component {
  render() {
    return (
      <Container style={[this.props.style, styles.container]}>
        <GamePiece piece={this.props.pieces[0]} pieceIndex={0} style={styles.gamePiece}/>
        <GamePiece piece={this.props.pieces[1]} pieceIndex={1} style={styles.gamePiece}/>
        <GamePiece piece={this.props.pieces[2]} pieceIndex={2} style={styles.gamePiece}/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gamePiece: {
    backgroundColor: 'gray',
    flex: 1,
    aspectRatio: 1,
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 5
  }
});

export default withRouter(GamePieceSection);