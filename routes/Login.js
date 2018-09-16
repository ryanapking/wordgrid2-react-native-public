import { Col, Grid, Row } from "react-native-easy-grid";
import {StyleSheet, Text} from "react-native";
import Wordbutton from "../components/Wordbutton";
import { Button, Container } from "native-base";
import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-native';

import { userLogin } from '../ducks/user';


class Login extends Component {
  render() {
    return (
      <Grid style={loginStyles.container}>
        <Row style={loginStyles.center}>
          <Col>
            <Button block danger onPress={this.props.userLogin}>
              <Text>Login</Text>
            </Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const loginStyles = StyleSheet.create({
  container: {
    backgroundColor: '#5b7aff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = () => {
  return {

  };
};

const mapDispatchToProps = {
  userLogin
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));