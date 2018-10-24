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
      pieceLocation: new Animated.ValueXY(),
    };

  }

  componentDidMount() {
    this.setState({
      animation: getAnimationData(this.props.game),
    });

    // Animated.timing(this.state.pieceLocation, {
    //   toValue: { x: -100, y: -100 },
    //   duration: 1000
    // }).start();
  }

  render() {

    const { animation } = this.state;
    if (!animation) return null;
    const transform = {transform: [{translateX: this.state.pieceLocation.x}, {translateY: this.state.pieceLocation.y}]};

    console.log('rendering state...', this.state);

    return (
      <Container style={styles.container}>

        <Container style={[this.props.style, styles.gamePiecesContainer, {flex: 1}]}>
          <Container style={[styles.gamePieceContainer]}>
            <Animated.View style={[transform]}>
              <GamePiece piece={animation.pieceStates.start[0]} pieceIndex={0} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </Container>
          <Container style={styles.gamePieceContainer}>
            <Animated.View style={[transform]}>
              <GamePiece piece={animation.pieceStates.start[1]} pieceIndex={1} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </Container>
          <Container style={styles.gamePieceContainer}>
            <Animated.View style={[transform]}>
              <GamePiece piece={animation.pieceStates.start[2]} pieceIndex={2} style={styles.gamePiece} allowDrag={false}/>
            </Animated.View>
          </Container>
        </Container>

        <View style={styles.base} ref={(view) => this._board = view} onLayout={() => this._onBoardLayout()}>
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

  _onBoardLayout() {
    console.log('laying out board', this._board);
    this._board.measureInWindow((x, y, width, height) => {
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