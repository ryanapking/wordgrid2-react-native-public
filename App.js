import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import Router from './routes/Router';
import configureStore from './store/configureStore';

const store = configureStore();

StatusBar.setHidden(true);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}
