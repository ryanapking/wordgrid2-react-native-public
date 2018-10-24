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
      animation: null,
      pieceStyles: null,
      pieceLocation: new Animated.ValueXY(),
    };

  }

  componentDidMount() {
    this.setState({
      animation: getAnimationData(this.props.game),
    });

    Animated.timing(this.state.pieceLocation, {
      toValue: { x: -100, y: -100 },
      duration: 1000
    }).start();
  }

  render() {

    console.log('rendering state...', this.state);

    if (!this.state.animation) return null;

    const transform = {transform: [{translateX: this.state.pieceLocation.x}, {translateY: this.state.pieceLocation.y}]};

    return (
      <Container style={styles.container}>

        <Container style={[this.props.style, styles.gamePiecesContainer, {flex: 1}]}>
          <Container style={[styles.gamePieceContainer, {zIndex: 999}]}>
            <Animated.View ref={(piece) => this._piece1 = piece} onLayout={() => this._onPiece1Layout()}
                  style={[{backgroundColor: 'green', width: '100%', height: '100%', zIndex: 999}, transform]}
            >
              <GamePiece piece={this.state.animation.pieceStates.start[0]} pieceIndex={0} style={[styles.gamePiece, this.state.pieceStyles]} allowDrag={false}/>
            </Animated.View>
          </Container>
          <Container style={styles.gamePieceContainer}>
            <Animated.View ref={(piece) => this._piece2 = piece} onLayout={() => this._onPiece2Layout()} style={transform}>
              <GamePiece piece={this.state.animation.pieceStates.start[1]} pieceIndex={1} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </Container>
          <Container style={styles.gamePieceContainer}>
            <View ref={(piece) => this._piece3 = piece} onLayout={() => this._onPiece3Layout()}>
              <GamePiece piece={this.state.animation.pieceStates.start[2]} pieceIndex={2} style={styles.gamePiece} allowDrag={false}/>
            </View>
          </Container>
        </Container>

        <View style={styles.base} ref={(view) => this._board = view} onLayout={() => this._onBoardLayout()}>
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

  _onBoardLayout() {
    console.log('laying out board', this._board);
    this._board.measureInWindow((x, y, width, height) => {
      console.log(x, y, width, height);
      this.setState({
        pieceStyles: {
          // position: 'absolute',
          // left: 0,
          // top: 0,
          // width: '100%',
          // zIndex: 9999999999,
          // backgroundColor: 'blue'
        }
      })
    });

    console.log('state:', this.state);
  }

  _onPiece1Layout() {
    console.log('piece 1 layout');
    // this._piece1.measureInWindow((x, y, width, height) => {
    //   console.log(x, y, width, height);
    // });
  }

  _onPiece2Layout() {
    console.log('piece 2 layout');
    // this._piece2.measureInWindow((x, y, width, height) => {
    //   console.log(x, y, width, height);
    // });
  }

  _onPiece3Layout() {
    console.log('piece 3 layout');
    this._piece3.measureInWindow((x, y, width, height) => {
      console.log(x, y, width, height);
    });
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