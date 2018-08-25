import { Col, Grid, Row } from "react-native-easy-grid";
import {StyleSheet, Text} from "react-native";
import Wordbutton from "../components/Wordbutton";
import { Button, Container } from "native-base";
import React, { Component } from "react";


export default class Login extends Component {
  render() {
    return (
        <Grid style={loginStyles.container}>
          <Row>
            <Col style={loginStyles.center}><Text>Mo text!</Text></Col>
            <Col style={loginStyles.center}><Text>Changes you make will automatically reload.</Text></Col>
            <Col style={loginStyles.center}><Text>Shake your phone to open the developer menu.</Text></Col>
          </Row>
          <Row style={loginStyles.center}>
            <Col>
              <Wordbutton />
              <Button block success style={loginStyles.center}>
                <Text>app.js Button Text</Text>
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