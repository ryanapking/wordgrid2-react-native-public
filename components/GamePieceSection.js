import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import GamePiece from './GamePiece';

class GamePieceSection extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece piece={this.props.pieces.one}/>
          </Col>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece piece={this.props.pieces.two}/>
          </Col>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece piece={this.props.pieces.three}/>
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

const mapStateToProps = (state) => {
  return {
    pieces: state.board.pieces
  };
};

export default withRouter(connect(mapStateToProps)(GamePieceSection));