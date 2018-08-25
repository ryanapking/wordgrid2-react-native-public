import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../ducks/reducer';

export default function configureStore(initialState) {
  return createStore(
    reducer,
    applyMiddleware(thunk)
  );
}