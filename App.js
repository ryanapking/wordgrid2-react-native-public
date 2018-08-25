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

import Loginscreen from './screens/Loginscreen';

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
        <Loginscreen />
      </Provider>
    );
  }
}