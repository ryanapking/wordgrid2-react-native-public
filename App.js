import React, { Component } from 'react';
import { StyleSheet, Text, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NativeRouter, Route, Link } from 'react-router-native'
import { Grid, Row, Col } from 'react-native-easy-grid';

import Login from './routes/Login';
import Game from './routes/Game';
import Home from './routes/Home';
import configureStore from './store/configureStore';

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
                <Route path="/home" component={Home}/>
                <Route exact path="/" component={Game}/>
                <Route path="/login" component={Login}/>
              </Row>
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
})