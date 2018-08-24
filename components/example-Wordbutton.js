import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { Container, Button } from 'native-base';

import { successTest } from '../ducks/reducer';

class Wordbutton extends Component {
  render() {
    const { testData } = this.props;
    return (
      <Container>
        <Button block danger onPress={this.props.successTest}><Text>Wordbutton.js Text</Text></Button>
        <Text>Something: {testData}</Text>
      </Container>
    );
  }
}

// the ducks data mapped onto props.... the name seems to explain it, not sure what my note is for
const mapStateToProps = (state) => {
  return {
    testData: state.testData
  }
};

// the ducks action creators available as props
const mapDispatchToProps = {
  successTest
};

export default connect(mapStateToProps, mapDispatchToProps)(Wordbutton);