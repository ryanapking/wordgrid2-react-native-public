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
            <GamePiece piece={this.props.pieces[0]} pieceIndex={0}/>
          </Col>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece piece={this.props.pieces[1]} pieceIndex={1}/>
          </Col>
          <Col size={2.5} style={styles.spacer} />
          <Col size={30} style={styles.pieceSpace}>
            <GamePiece piece={this.props.pieces[2]} pieceIndex={2}/>
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
    pieces: state.gameData.pieces
  };
};

export default withRouter(connect(mapStateToProps)(GamePieceSection));