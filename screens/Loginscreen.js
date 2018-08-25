import { Col, Grid, Row } from "react-native-easy-grid";
import {StyleSheet, Text} from "react-native";
import Wordbutton from "../components/Wordbutton";
import { Button, Container } from "native-base";
import React, { Component } from "react";


export default class Loginscreen extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Grid style={{width: '100%'}}>
          <Row>
            <Col style={styles.center}><Text>Mo text!</Text></Col>
            <Col style={styles.center}><Text>Changes you make will automatically reload.</Text></Col>
            <Col style={styles.center}><Text>Shake your phone to open the developer menu.</Text></Col>
          </Row>
          <Row style={styles.center}>
            <Col>
              <Wordbutton />
              <Button block success style={styles.center}>
                <Text>app.js Button Text</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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