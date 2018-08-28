import React, { Component } from 'react';
import { Text, Dimensions, StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

import GridSquare from '../components/GridSquare';
import GamePiece from '../components/GamePiece';
import GamePieceSection from '../components/GamePieceSection';


export default class Game extends Component {
  render() {

    const window = Dimensions.get('window');
    const width = window.width;
    const height = window.width;

    let rows = 10;
    let cols = 10;

    return (
      <Container>
        <Container style={{height: height, width: width, flex: 0}}>
          <Grid>
            {Array(rows).fill(1).map((a, i) =>
              <Row key={i}>
                {Array(cols).fill(1).map( (a, i) =>
                  <Col key={i}><GridSquare letter={"v"}></GridSquare></Col>
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