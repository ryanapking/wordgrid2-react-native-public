import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { Provider } from 'react-redux';
import { NativeRouter, Link, Route } from'react-router-native';
import { Col, Grid, Row } from "react-native-easy-grid";

import configureStore from './store/configureStore';

// routes
import Home from "./routes/Home";
import Login from "./routes/Login";
import Game from "./routes/Game";
import Games from "./routes/Games";

// redirect all non-logged in users to the login screen
import LoginRedirect from "./components/nondisplay/LoginRedirect";
import FirebaseListeners from './components/nondisplay/FirebaseListeners';

const store = configureStore();

StatusBar.setHidden(true);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
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
                  underlayColor='#f0f4f7'
                  style={styles.navItem}>
                  <Text>Games</Text>
                </Link>
              </Row>
              <Row size={95}>
                <Route exact path="/" component={Home}/>
                <Route path="/login" component={Login} />
                <Route path="/game/:gameID" component={Game}/>
                <Route path="/games" component={Games}/>
              </Row>
              <LoginRedirect />
              <FirebaseListeners />
            </Col>
          </Grid>
        </NativeRouter>
      </Provider>
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