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
      pieceWidth: new Animated.Value(0),

      // for calculating animation values
      boardLocation: null,
      boardWidth: null,
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
    let pieceWidthStyle = {width: pieceWidth, height: pieceWidth, top: 0, left: 0, position: 'absolute'}

    const transform = {transform: [{translateX: pieceLocation.x}, {translateY: pieceLocation.y}, {scale}]};
    // const transform = null;

    return (
      <Container style={styles.container}>

        <Container style={[this.props.style, styles.gamePiecesContainer, {flex: 1, zIndex: 999}]}>
          <View style={styles.gamePieceContainer} ref={(piece) => this.pieceRefs[0] = piece} onLayout={() => this._measurePiece(0)}>
            <Animated.View style={[transform, {zIndex: 999, backgroundColor: 'green'}, pieceWidthStyle]}>
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

  _animate() {
    this._growPiece();
  }

  _growPiece() {
    const pieceWidth = this.state.letterWidth * 4;
    Animated.timing(this.state.pieceWidth, {toValue: pieceWidth, duration: 1000}).start( () => {
      this._measurePiece(0);
      this._slidePiece();
    });
  }

  _slidePiece() {
    const board = this.state.boardLocation;
    const offset = this.state.pieceStartingLocation;
    const x = board.x - offset.x;
    const y = board.y - offset.y;
    // console.log('sliding to', offset);
    Animated.timing(this.state.pieceLocation, {
      toValue: { x, y },
      duration: 1000
    }).start();
  }

  _measureBoard() {

    console.log('_measureBoard state pieceWidth', this.state.pieceWidth);

    this._board.measure((x, y, width, height) => {
      const boardLocation = {x, y};
      console.log('board location:', boardLocation);
      Animated.timing(this.state.pieceWidth, {
        toValue: (width / 10) * 4,
        duration: 0
      }).start();
      this.setState({ boardLocation, boardWidth: width, letterWidth: (width / 10) });
    });
  }

  _measurePiece(pieceIndex) {
    console.log('measuring piece');
    this.pieceRefs[pieceIndex].measure( (x, y) => {
      const pieceStartingLocation = {x, y};
      console.log('piece starting location:', pieceStartingLocation);
      this.setState({pieceStartingLocation});
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight: '100%',
    maxWidth: '100%',
    aspectRatio: 1,
    backgroundColor: 'gray',
  },
  gamePiece: {
    backgroundColor: 'blue',
    width: '100%',
    height: '100%',
    // maxWidth: '100%',
    // maxHeight: '100%',
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