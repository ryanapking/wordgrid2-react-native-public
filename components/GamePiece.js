import React, { Component } from 'react';
import {StyleSheet, View, PanResponder, Animated, Text} from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import { Container } from 'native-base';

import { placePiece } from '../ducks/gameData';
import GameLetter from './GameLetter';

class GamePiece extends Component {

  constructor() {
    super();
    this.state = {
      // used for local animations
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),

      // used for styling the current piece
      dragging: false,
      canDrop: false,

      // height of the GamePiece, before scaling
      baseWidth: null,
      baseHeight: null
    };

    // height of the GamePiece after scaling
    this.currentSize = {
      width: 0,
      height: 0
    };

    // middle points of the current GamePiece squares that contain letters
    this.relativeMiddlePoints = [];

    this._onStartShouldSetPanResponderCapture = this._onStartShouldSetPanResponderCapture.bind(this);
    this._onMoveShouldSetPanResponderCapture = this._onMoveShouldSetPanResponderCapture.bind(this);
    this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
    this._onPanResponderMove = this._onPanResponderMove.bind(this);
    this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
    this._getSquaresBelowPiece = this._getSquaresBelowPiece.bind(this);
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this.state.scale.addListener((value) => this._setCurrentSize(value));

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: this._onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponderCapture: this._onMoveShouldSetPanResponderCapture,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
    });
  }

  render() {
    const { pan, scale } = this.state;

    const dragTransforms = {transform: [{translateX: pan.x}, {translateY: pan.y}, {scale}]};
    const letterDragStyles = this.state.canDrop ? styles.canDrop : {};
    const letterHeight = this.state.baseHeight / 4;

    return (
      <View
        ref={baseView => this.baseView = baseView}
        onLayout={ () => this._onLayout() }
        style={this.props.style}
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[styles.square, dragTransforms]}
          rev={animatedView => this.animatedView = animatedView}
        >
          <Container style={styles.grid} pointerEvents={'none'}>
            {this.props.piece.map( (pieceRow, index) =>
              <View style={styles.row} key={index}>
                {pieceRow.map( (letter, index) =>
                  <View style={styles.column} key={index}>
                    { letter ? <GameLetter style={letterDragStyles} letter={letter} letterHeight={letterHeight}/> : null }
                  </View>
                )}
              </View>
            )}
          </Container>
        </Animated.View>
      </View>
    );
  }

  _onLayout() {
    // measure the size of the base view, which does not scale with the visible game piece
    // when the piece scales, this is our reference point to calculate
    this.baseView.measureInWindow((x, y, width, height) => {
      this.setState({
        baseWidth: width,
        baseHeight: height
      })
    });
  }

  _setCurrentSize(currentScale) {
    // use the base piece size and current scale to determine the piece's current size
    const height = this.state.baseHeight * currentScale.value;
    const width = this.state.baseWidth * currentScale.value;
    this.currentSize = {width, height};
    this._setRelativeMiddlePoints();
  }

  _setRelativeMiddlePoints() {
    // for each letter in the piece, the current middle point is saved to an array
    let relativeMiddlePoints = [];
    this.props.piece.forEach( (row, rowIndex ) => {
      row.forEach( (letter, columnIndex) => {
        if (letter) {
          const x = ((columnIndex) * (this.currentSize.width / 4)) + (this.currentSize.width / 8);
          const y = ((rowIndex) * (this.currentSize.height / 4)) + (this.currentSize.height / 8);
          relativeMiddlePoints.push({x, y, pieceRowIndex: rowIndex, pieceColumnIndex: columnIndex, letter});
        }
      })
    });
    this.relativeMiddlePoints = relativeMiddlePoints;
  }

  _getSquaresBelowPiece(event) {
    // set the x and y coordinates of the piece being dragged
    // locationX and locationY are set based on initial size, so the distances must be scaled
    const elementX = event.nativeEvent.pageX - (event.nativeEvent.locationX * this.state.scale._value);
    const elementY = event.nativeEvent.pageY - (event.nativeEvent.locationY * this.state.scale._value);

    // check beneath all piece squares containing letters
    const squaresBelow = this.relativeMiddlePoints.map( (point) => {
      // set the middle point as an absolute board position
      const currentMiddlePointX = elementX + point.x;
      const currentMiddlePointY = elementY + point.y;

      const maxRowDiff = this.props.boardLocation.rowHeight / 2;
      const maxColumnDiff = this.props.boardLocation.columnWidth / 2;

      // compare point to row bounds and return row index
      const row = this.props.boardLocation.rowMidPoints.reduce( (foundRow, midPointY, index ) => {
        const rowDiff = Math.abs(midPointY - currentMiddlePointY);
        if ( rowDiff < maxRowDiff ) {
          return index;
        } else {
          return foundRow;
        }
      }, -1 );

      // compare point to column bounds and return column index
      const column = this.props.boardLocation.columnMidPoints.reduce( (foundColumn, midPointX, index) => {
        const columnDiff = Math.abs(midPointX - currentMiddlePointX);
        if ( columnDiff < maxColumnDiff ) {
          return index;
        } else {
          return foundColumn;
        }
      }, -1);

      // confirm that the piece is on the board and grab the letter below
      const onBoard = (row >= 0 && column >= 0);
      const letterBelow = onBoard ? this.props.board.rows[row][column] : null;

      return {...point, boardRowIndex: row, boardColumnIndex: column, letterBelow};
    });

    // console.log("squaresBelow: ", squaresBelow);

    return squaresBelow;
  }

  _checkDropReducer( canDropStatus, squareBelow) {
    return (canDropStatus && squareBelow.letterBelow === "");
  }

  _onStartShouldSetPanResponderCapture() {
    return this.props.allowDrag;
  }

  _onMoveShouldSetPanResponderCapture() {
    return this.props.allowDrag;
  }

  _onPanResponderGrant() {
    this.setState({dragging: true, canDrop: false});
    this.state.pan.setValue({x: 0, y: 0});
    const scaleTo = this.props.boardLocation.rowHeight / (this.state.baseHeight / 4);
    Animated.timing(
      this.state.scale,
      { toValue: scaleTo, duration: 200 }
    ).start();
  }

  _onPanResponderRelease(event) {
    this.setState({dragging: false, canDrop: false});
    Animated.timing(this.state.pan, {
      toValue: { x: 0, y: 0 },
      duration: 200
    }).start();
    Animated.timing(
      this.state.scale,
      { toValue: 1, duration: 200 }
    ).start();

    const squaresBelow = this._getSquaresBelowPiece(event);
    const canDrop = squaresBelow.reduce(this._checkDropReducer, true);

    // console.log('squaresBelow: ', squaresBelow);
    // console.log('candrop: ', canDrop);

    if (canDrop) {
      let updatedRows = [...this.props.board.rows];

      squaresBelow.forEach( (square) => {
        updatedRows[square.boardRowIndex][square.boardColumnIndex] = square.letter;
      });

      this.props.placePiece(updatedRows, this.props.pieceIndex, this.props.gameID);
    }
  }

  _onPanResponderMove(event, gestureState) {
    Animated.event([null, {
      dx: this.state.pan.x,
      dy: this.state.pan.y,
    }])(event, gestureState);

    const squaresBelow = this._getSquaresBelowPiece(event);

    // we should only update state if required. it is too expensive to render one very move event.
    const canDrop = squaresBelow.reduce(this._checkDropReducer, true);

    if (canDrop !== this.state.canDrop) {
      this.setState({canDrop});
    }
  }
}
const styles = StyleSheet.create({
  square: {
    width: "100%",
    height: "100%",
  },
  canDrop: {
    backgroundColor: '#55a22e'
  },
  grid: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  column: {
    flex: 1,
  }
});

const mapStateToProps = (state, ownProps) => {
  const gameID = ownProps.match.params.gameID;
  return {
    gameID: gameID,
    boardLocation: state.gameDisplay.boardLocation,
    board: state.gameData.byID[gameID]
  };
};

const mapDispatchToProps = {
  placePiece
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GamePiece));