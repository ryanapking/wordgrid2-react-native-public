import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';
import PropTypes from 'prop-types';

class GameBoardPath extends Component {
  constructor() {
    super();

    this._getRelativeCoordinates = this._getRelativeCoordinates.bind(this);
  }
  render() {
    const { square1, square2 } = this.props;
    const p1 = this._getRelativeCoordinates(square1.rowIndex, square1.columnIndex);
    const p2 = this._getRelativeCoordinates(square2.rowIndex, square2.columnIndex);
    const angle = this._calculateAngle(p1, p2);
    const length = this._calculateLength(p1, p2);
    const midpoint = this._calculateMidPoint(p1, p2);

    const height = 5;

    const styles = StyleSheet.create({
      pretty: {
        left: midpoint.x - (length / 2),
        top: midpoint.y - (height / 2),
        width: length,
        transform: [{rotate: angle + 'deg'}],
        height: height,
        borderRadius: height / 2,
        backgroundColor: '#5283ff',
        position: 'absolute'
      }
    });

    return (
      <View style={styles.pretty}></View>
    );
  }

  _getRelativeCoordinates(rowIndex, columnIndex) {
    const y = (rowIndex + .5) * this.props.display.boardLocation.rowHeight;
    const x = (columnIndex + .5) * this.props.display.boardLocation.columnWidth;
    return { x, y };
  }

  _calculateLength(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  _calculateMidPoint(p1, p2) {
    const x = (p1.x + p2.x) / 2;
    const y = (p1.y + p2.y) / 2;
    return {x, y};
  }

  _calculateAngle(p1, p2) {
    var dy = p1.y - p2.y;
    var dx = p1.x - p2.x;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }

  static propTypes = {
    square1: PropTypes.shape({
      rowIndex: PropTypes.number,
      columnIndex: PropTypes.number
    })
  };
}

const mapStateToProps = (state) => {
  return {
    display: state.gameDisplay
  }
};

export default withRouter(connect(mapStateToProps)(GameBoardPath));