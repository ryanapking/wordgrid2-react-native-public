import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

class GamePhaseDisplay extends Component {
  render() {
    const wordPlayed = !!this.props.game.word;

    let playStyles = styles.disabled;
    let placeStyles = styles.disabled;

    if (!wordPlayed) {
      playStyles = styles.enabled;
    } else if (!this.props.game.piecePlaced) {
      placeStyles = styles.enabled;
    }

    return (
      <View style={{height: 35}}>
        <Grid>
          <Col>
            <Row style={[styles.col, playStyles]}>
              <Text>
                Play Word
              </Text>
            </Row>
            <Row style={[styles.col, placeStyles]}>
              <Text>
                Place Piece
              </Text>
            </Row>
          </Col>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  col: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabled: {
    backgroundColor: 'lightgray'
  },
  enabled: {
    backgroundColor: '#53adff'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    game: state.gameData.byID[ownProps.match.params.gameID]
  };
};

export default withRouter(connect(mapStateToProps)(GamePhaseDisplay));