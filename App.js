import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Wordbutton from './components/Wordbutton';

import reducer from './ducks/reducer';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { Container, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import firebase from 'react-native-firebase';

var store = createStore(reducer, applyMiddleware(thunk));

// firebase.auth().signInAnonymously()
//   .then((user) => {
//     console.log("login success");
//     console.log(user.isAnonymous);
//   })
//   .catch((e) => {
//     console.log("login error, yo");
//     console.log(e);
//   });
//
// var db = firebase.firestore();
//
// var testCollection = db.collection('test');
//
// testCollection.doc('jane').set({
//   lastName: 'keyler', state: 'OR'
// });
//
// db.collection('test').get()
//   .then((collection) => {
//     console.log("get collection success");
//     console.log(collection);
//   })
//   .catch((e) => {
//     console.log("get collection error");
//     console.log(e);
//   });

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container style={styles.container}>
          <Grid style={{width: '100%'}}>
            <Row>
              <Col style={styles.center}><Text>Open up App.js to start working on your app!</Text></Col>
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
      </Provider>
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
