import { combineReducers } from 'redux';

import login from './login';
import board from './board';

// reducer
export default combineReducers({
  login: login,
  board: board
});
