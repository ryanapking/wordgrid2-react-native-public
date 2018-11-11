import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

class GameReview extends Component {
  render() {
    return (
      <View style={styles.mainView}>
        <Text>GameReview.js</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
  }
});

const mapStateToProps = (state) => {
  return {

  }
};

export default withRouter(connect(mapStateToProps)(GameReview));