import React, { Component } from 'react';
import { Text, StyleSheet, Animated, View } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import { getAnimationData } from "../utilities";
import GameLetter from "./GameLetter";
import GamePiece from "./GamePiece";

class GameAnimation extends Component {
  constructor() {
    super();

    this.state = {
      // data concerning what is moving where
      animation: null,

      // animation values
      pieceLocation: new Animated.ValueXY(),
      scale: new Animated.Value(1),

      // for calculating animation values
      boardLocation: {
        x: 0,
        y: 0,
        width: null,
        height: null,
      },
      boardWidth: null,
      pieceStartingLocation: null,
    };

    this.pieceRefs = {};

  }

  componentDidMount() {
    console.log('did mount');
    this.setState({
      animation: getAnimationData(this.props.game),
    });
  }

  render() {

    const { animation, pieceLocation, scale } = this.state;
    if (!animation) return null;
    const transform = {transform: [{translateX: pieceLocation.x}, {translateY: pieceLocation.y}, {scale}]};


    return (
      <Container style={styles.container}>

        <Container style={[this.props.style, styles.gamePiecesContainer, {flex: 1, zIndex: 999}]}>
          <View style={styles.gamePieceContainer} ref={(piece) => this.pieceRefs[0] = piece} onLayout={() => this._measurePiece(0)}>
            <Animated.View style={[transform, {zIndex: 999, backgroundColor: 'green'}]}>
              <GamePiece piece={animation.pieceStates.start[0]} pieceIndex={0} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </View>
          <View style={styles.gamePieceContainer}>
            <Animated.View style={[]}>
              <GamePiece piece={animation.pieceStates.start[1]} pieceIndex={1} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </View>
          <View style={styles.gamePieceContainer}>
            <Animated.View style={[]}>
              <GamePiece piece={animation.pieceStates.start[2]} pieceIndex={2} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </View>
        </Container>

        <View style={styles.base} ref={(view) => this._board = view} onLayout={() => this._measureBoard()}>
          <View style={styles.grid}>
            {animation.boardStates.start.map((row, rowIndex) =>
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

  _measureBoard() {
    console.log('laying out board', this._board);
    this._board.measure((x, y, width, height) => {
      console.log('board location:', x, y, width, height);



      Animated.timing(this.state.pieceLocation, {
        toValue: { x: x - 2, y: y - 4 },
        duration: 1000
      }).start();

      Animated.timing(this.state.scale, {toValue: 1.33, duration: 1000}).start();


      this.setState({
        boardLocation: {
          x,
          y,
          width,
          height
        },
        boardWidth: width
      })
    });
  }

  _measurePiece(pieceIndex) {
    this.pieceRefs[pieceIndex].measure( (x, y, width, height) => {
      this.setState({
        pieceStartingLocation: {
          x,
          y,
          width,
          height
        }
      });
      console.log('piece coordinates');
      console.log(x, y, width, height);
    });

    console.log('state', this.state);
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    aspectRatio: 1,
    backgroundColor: 'gray',
  },
  gamePiece: {
    maxWidth: '100%',
    maxHeight: '100%',
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