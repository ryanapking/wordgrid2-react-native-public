import React, { Component } from 'react';
import {Text, StyleSheet, View} from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import { boardStringToArray, pieceStringToArray, getAnimationData } from "../utilities";
import GameLetter from "./GameLetter";
import GamePiece from "./GamePiece";

class GameAnimation extends Component {
  constructor() {
    super();

    this.state = {
      animation: null
    }
  }

  componentDidMount() {
    this.setState({
      animation: getAnimationData(this.props.game),
    });
  }

  render() {

    if (!this.state.animation) return null;

    return (
      <Container style={styles.container}>

        <Container style={[this.props.style, styles.gamePiecesContainer, {flex: 1}]}>
          <Container style={styles.gamePieceContainer}>
            <GamePiece piece={this.state.animation.pieceStates.start[0]} pieceIndex={0} style={styles.gamePiece} allowDrag={false}/>
          </Container>
          <Container style={styles.gamePieceContainer}>
            <GamePiece piece={this.state.animation.pieceStates.start[1]} pieceIndex={1} style={styles.gamePiece} allowDrag={false}/>
          </Container>
          <Container style={styles.gamePieceContainer}>
            <GamePiece piece={this.state.animation.pieceStates.start[2]} pieceIndex={2} style={styles.gamePiece} allowDrag={false}/>
          </Container>
        </Container>

        <View style={styles.base}>
          <View style={styles.grid}>
            {this.state.animation.boardStates.start.map((row, rowIndex) =>
              <View key={rowIndex} style={styles.row}>
                {row.map( (letter, columnIndex) => {
                  return (
                    <View key={columnIndex} style={[styles.centered, styles.column]}>
                      <GameLetter letter={letter} letterHeight={this.props.display.boardLocation.rowHeight}/>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        </View>

        <View style={{flex: 1}}>

        </View>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  base: {
    maxWidth: "100%",
    maxHeight: "100%",
    aspectRatio: 1,
    backgroundColor: 'lightgray',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  column: {
    flex: 1
  },
  letter: {
    fontSize: 20
  },
  filledSquare: {
    backgroundColor: "#ffd27b",
  },
  emptySquare: {
    backgroundColor: "#9c9c9c"
  },
  usedSquare: {
    backgroundColor: "#ffa487",
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameBoardView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  gamePiecesContainer: {
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
  },
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
    uid: state.user.uid,
    display: state.gameDisplay
  };
};

export default withRouter(connect(mapStateToProps)(GameAnimation));