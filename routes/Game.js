import React, { Component } from 'react';
import { Text, Dimensions, StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import GridSquare from '../components/GridSquare';
import GamePieceSection from '../components/GamePieceSection';


class Game extends Component {
  render() {
    const { board } = this.props;
    console.log("board: ", board);

    const window = Dimensions.get('window');
    const width = window.width;
    const height = width;

    let rows = 10;
    let cols = 10;

    return (
      <Container>
        <Container style={{height: height, width: width, flex: 0}}>
          <Grid>
            {board.rows.map((row, i) =>
              <Row key={i}>
                {row.map( (letter, i) =>
                  <Col key={i}><GridSquare letter={letter} /></Col>
                )}
              </Row>
            )}
          </Grid>
        </Container>
        <Container style={{backgroundColor: 'lightgray'}}>
          <GamePieceSection />
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    // backgroundColor: '#ffd27b',
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: 'white',
  }
});

const mapStateToProps = (state) => {
  return {
    board: state.board
  }
}

const mapDispatchToProps = {

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));