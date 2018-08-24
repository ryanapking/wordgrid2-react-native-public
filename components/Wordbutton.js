import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { Container, Button } from 'native-base';

import { userLogin } from '../ducks/login';

class Wordbutton extends Component {
  render() {
    const { username } = this.props;
    return (
      <Container>
        <Button block danger onPress={this.props.userLogin}><Text>Wordbutton.js Text</Text></Button>
        <Text>Username: {username}</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.login.username,
  }
};

const mapDispatchToProps = {
  userLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(Wordbutton);