import React, { Component } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
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
      pieceWidth: new Animated.Value(0),

      // for calculating animation values
      boardLocation: null,
      pieceStartingLocation: null,
      letterWidth: null,
    };

    this.pieceRefs = {};

    this.timer = setInterval( () => {
      if (this.state.animation && this.state.boardLocation && this.state.pieceStartingLocation) {
        clearInterval(this.timer);
        this._animate();
      }
    }, 3000)
  }

  componentDidMount() {
    this.setState({
      animation: getAnimationData(this.props.game),
    });
  }

  render() {

    const { animation, pieceLocation, scale, pieceWidth } = this.state;
    if (!animation) return null;

    console.log('animation', animation);

    const transform = {transform: [{translateX: pieceLocation.x}, {translateY: pieceLocation.y}, {scale}]};
    const motionPiece = [{width: pieceWidth, height: pieceWidth, zIndex: 999, transform}, transform];

    let animationStyles = {0: null, 1: null, 2: null};
    animationStyles[animation.placementRef.pieceIndex] = motionPiece;

    let onLayout = {0: null, 1: null, 2: null};
    onLayout[animation.placementRef.pieceIndex] = () => this._measurePiece(animation.placementRef.pieceIndex);


    return (
      <Container style={styles.container}>

        <Container style={[this.props.style, styles.gamePiecesContainer, {flex: 1, zIndex: 999}]}>
          <View style={styles.gamePieceContainer} ref={(piece) => this.pieceRefs[0] = piece} onLayout={onLayout[0]}>
            <Animated.View style={animationStyles[0]}>
              <GamePiece piece={animation.pieceStates.start[0]} pieceIndex={0} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </View>
          <View style={styles.gamePieceContainer} ref={(piece) => this.pieceRefs[1] = piece} onLayout={onLayout[1]}>
            <Animated.View style={animationStyles[1]}>
              <GamePiece piece={animation.pieceStates.start[1]} pieceIndex={1} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </View>
          <View style={styles.gamePieceContainer} ref={(piece) => this.pieceRefs[2] = piece} onLayout={onLayout[2]}>
            <Animated.View style={animationStyles[2]}>
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

  _animate() {
    const { rowIndex, columnIndex } = this.state.animation.placementRef;
    this._growPiece();
    this._slidePiece(rowIndex, columnIndex);
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
    }).start();
  }

  _measureBoard() {
    this._board.measure((x, y, width, height) => {
      const boardLocation = {x, y};
      console.log('board location:', boardLocation);
      this.setState({ boardLocation, letterWidth: (width / 10) });
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
      console.log('piece starting location:', {x, y});
      this.setState({pieceStartingLocation: {x, y}});
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
    maxHeight: '100%',
    maxWidth: '100%',
    aspectRatio: 1,
    backgroundColor: 'gray',
  },
  gamePiece: {
    backgroundColor: 'blue',
    width: '100%',
    height: '100%',
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