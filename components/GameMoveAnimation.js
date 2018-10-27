import React, { Component } from 'react';
import { StyleSheet, Animated, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import { markAnimationPlayed } from "../ducks/gameData";
import { getAnimationData } from "../utilities";
import { SPACE_EMPTY, SPACE_FILLED, SPACE_CONSUMED } from "../constants";
import GamePiece from "./GamePiece";
import GameBoardPathCreator from "./GameBoardPathCreator";
import DrawBoard from './DrawBoard';

class GameMoveAnimation extends Component {
  constructor() {
    super();

    this.state = {
      // data concerning what is moving where
      animation: null,

      // animation values
      pieceLocation: new Animated.ValueXY(),
      pieceWidth: new Animated.Value(0),

      displayWordPath: [],
      boardState: [],
      message: "",

      // animation phase progress
      animationPhase: 'waiting to start',

      // for calculating animation values
      boardLocation: null,
      pieceStartingLocation: null,
      letterWidth: null,
      boardSize: 0, // width and height will match
    };

    this.pieceRefs = {};

    this._animate();

  }

  componentDidMount() {
    const animation = getAnimationData(this.props.game);
    this.setState({
      animation: animation,
      boardState: animation.boardStates.start,
    });
  }

  render() {

    const { animation, pieceLocation, pieceWidth, letterWidth, displayWordPath, boardState, boardSize, message } = this.state;
    if (!animation) return null;

    const transform = {transform: [{translateX: pieceLocation.x}, {translateY: pieceLocation.y}]};
    const motion = [{width: pieceWidth, height: pieceWidth, zIndex: 999}, transform];

    const pieces = animation.pieceStates.start.map( (letters, index) => {
      if (index === animation.placementRef.pieceIndex) {
        let onLayout = () => this._measurePiece(index);
        return {letters, animationStyles: motion, onLayout};
      } else {
        return {letters, animationStyles: null, onLayout: null}
      }
    });

    const boardLocation = {
      rowHeight: letterWidth,
      columnWidth: letterWidth,
    };

    const displayBoardState = boardState.map( (row, rowIndex) => {
      return row.map( (letter, columnIndex) => {
        if (!letter) {
          return {letter, status: SPACE_EMPTY};
        } else if (this._checkSpaceConsumed(displayWordPath, rowIndex, columnIndex)) {
          return {letter, status: SPACE_CONSUMED};
        } else {
          return {letter, status: SPACE_FILLED};
        }
      });
    });

    const displayWord = animation.word.substring(0, displayWordPath.length);

    return (
      <Container style={styles.container}>

        <Container style={styles.gamePiecesContainer}>
          { pieces.map( (piece, index) =>
            <View key={index} style={styles.gamePieceContainer} ref={(piece) => this.pieceRefs[index] = piece} onLayout={piece.onLayout}>
              <Animated.View style={piece.animationStyles}>
                <GamePiece piece={piece.letters} pieceIndex={index} style={styles.gamePiece} allowDrag={false}/>
              </Animated.View>
            </View>
          )}
        </Container>

        <View style={styles.base} ref={(view) => this._board = view} onLayout={() => this._measureBoard()}>
          <DrawBoard boardState={displayBoardState} boardSize={boardSize}/>
          <GameBoardPathCreator squares={displayWordPath} boardLocation={boardLocation}/>
        </View>

        <View style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{textAlign: 'center'}}>{ displayWord }</Text>
          <Text style={{textAlign: 'center'}}>{ message }</Text>
        </View>

      </Container>
    );
  }

  _animate() {

    let interval = setInterval( () => {
      // make sure all the needed data exists before starting the animation
      if (!this.state.animation || !this.state.boardLocation || !this.state.pieceStartingLocation) {
        return;
      }

      switch (this.state.animationPhase) {
        case "waiting to start":
          this.setState({animationPhase: "drawing word"});
          this._drawWord();
          break;
        case "word drawn":
          this.setState({animationPhase: "swapping board", message: this.state.animation.points + " points"});
          this._swapBoards();
          break;
        case "board swapped":
          this.setState({animationPhase: "growing piece"});
          const { rowIndex, columnIndex } = this.state.animation.placementRef;
          this._growPiece();
          this._slidePiece(rowIndex, columnIndex);
          break;
        case "piece moved":
          this.setState({animationPhase: "complete"});
          break;
        // case "piece grown":
        //   this.setState({animationPhase: "sliding piece"});
        //   const { rowIndex, columnIndex } = this.state.animation.placementRef;
        //   this._slidePiece(rowIndex, columnIndex);
        //   break;
        // case "piece slid":
        //   this.setState({animationPhase: "complete"});
        //   break;
        case "complete":
          console.log('animation complete');
          clearInterval(interval);
          // this.props.markAnimationPlayed(this.props.gameID);
          break;
      }

    }, 100);

  }

  _growPiece() {
    const pieceWidth = this.state.letterWidth * 4;
    Animated.timing(this.state.pieceWidth, {
      toValue: pieceWidth,
      duration: 1000
    }).start();
  }

  _slidePiece(row = 0, column = 0) {
    const board = this.state.boardLocation;
    const letterWidth = this.state.letterWidth;
    const offset = this.state.pieceStartingLocation;
    const left = board.x - offset.x;
    const top = board.y - offset.y;
    const x = left + (letterWidth * column);
    const y = top + (letterWidth * row);
    Animated.timing(this.state.pieceLocation, {
      toValue: { x, y },
      duration: 1000
    }).start( () => {
      this.setState({animationPhase: "piece moved"});
    });
  }

  _drawWord() {
    let interval = setInterval( () => {
      const allSquares = this.state.animation.wordPath;
      const currentSquares = this.state.displayWordPath;
      if (currentSquares.length < allSquares.length) {
        this.setState({
          displayWordPath: allSquares.slice(0, currentSquares.length + 1),
        });
      } else {
        clearInterval(interval);
        this.setState({animationPhase: "word drawn"});
      }
    }, 1000);
  }

  _swapBoards() {
    this.setState({
      boardState: this.state.animation.boardStates.between,
      displayWordPath: [],
      animationPhase: "board swapped"
    });
  }

  _measureBoard() {
    this._board.measure((x, y, width, height) => {
      const boardLocation = {x, y};
      // console.log('board location:', boardLocation);
      this.setState({ boardLocation, letterWidth: (width / 10), boardSize: width });
    });
  }

  _measurePiece(pieceIndex) {
    this.pieceRefs[pieceIndex].measure( (x, y, width, height) => {
      // setting a width to smooth out some animation kinks for the piece
      if (this.state.pieceWidth._value <= 0) {
        Animated.timing(this.state.pieceWidth, {
          toValue: width,
          duration: 0
        }).start();
      }
      // console.log('piece starting location:', {x, y});
      this.setState({pieceStartingLocation: {x, y}});
    });
  }

  _checkSpaceConsumed(usedSquares, rowIndex, columnIndex) {
    return usedSquares.reduce( (foundStatus, square) => {
      return (foundStatus || (rowIndex === square.rowIndex && columnIndex === square.columnIndex));
    }, false);
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
    alignItems: 'center',
    zIndex: 999,
    flex: 1,
  },
  gamePieceContainer: {
    flex: 1,
    margin: 2,
    maxHeight: '100%',
    maxWidth: '100%',
    aspectRatio: 1,
    backgroundColor: 'gray',
  },
  gamePiece: {
    // backgroundColor: 'blue',
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    game: state.gameData.byID[gameID],
  };
};

const mapDispatchToProps = {
  markAnimationPlayed
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameMoveAnimation));