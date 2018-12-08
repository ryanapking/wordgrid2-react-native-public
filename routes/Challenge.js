import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';

class Challenge extends Component {
  render() {
    return (
      <Text>Challenge.js</Text>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  }
};

export default withRouter(connect(mapStateToProps)(Challenge));