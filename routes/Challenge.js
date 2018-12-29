import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';

import { startChallenge } from "../ducks/challengeData";

class Challenge extends Component {
  componentDidMount() {
    this.props.startChallenge();
  }

  render() {
    return (
      <Text>Challenge.js</Text>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    challengeData: state.challengeData
  };
};

const mapDispatchToProps = {
  startChallenge,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Challenge));