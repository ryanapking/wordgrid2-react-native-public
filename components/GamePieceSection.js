import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';

import GamePiece from './GamePiece';

export default class GamePieceSection extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece />
          </Col>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece />
          </Col>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece />
          </Col>
          <Col size={2.5} style={styles.spacer} />
        </Row>
      </Grid>
    );
  }
}

const styles = StyleSheet.create({
  pieceSpace: {
    backgroundColor: "gray",
    aspectRatio: 1,
  },
  spacer: {

  }
});