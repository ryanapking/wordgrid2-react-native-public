import { combineReducers } from 'redux';

import login from './login';
import board from './board';
import display from './display';

// reducer
export default combineReducers({
  login: login,
  board: board,
  display: display
});
