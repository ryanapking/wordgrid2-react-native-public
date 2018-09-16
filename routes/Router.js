import React, { Component } from 'react';
import { StyleSheet, Text } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { NativeRouter, Route, Link, Redirect } from "react-router-native";

import Home from "./Home";
import Game from "./Game";
import Login from "./Login";
import Games from "./Games";

export default class Router extends Component {
  render() {
    return (
      <NativeRouter>
        <Grid>
          <Col>
            <Row size={5}>
              <Link
                to="/"
                underlayColor='#f0f4f7'
                style={styles.navItem}>
                <Text>Home</Text>
              </Link>
              <Link
                to="/games"
                style={styles.navItem}>
                <Text>Games</Text>
              </Link>
              <Link
                to="/game"
                underlayColor='#f0f4f7'
                style={styles.navItem}>
                <Text>Gamescreen</Text>
              </Link>
              <Link
                to="/login"
                underlayColor='#f0f4f7'
                style={styles.navItem} >
                <Text>Loginscreen</Text>
              </Link>
            </Row>
            <Row size={95}>
              <Route exact path="/" component={Home}/>
              <Route path="/game/:gameID" component={Game}/>
              <Route path="/login" component={Login}/>
              <Route path="/games" component={Games}/>
            </Row>
          </Col>
        </Grid>
      </NativeRouter>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10,
  },
  header: {
    fontSize: 20,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
  topic: {
    textAlign: 'center',
    fontSize: 15,
  }
});