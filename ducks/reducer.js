import { combineReducers } from 'redux';

import login from './login';
import board from './gameSource';
import display from './gameDisplay';
import gameChanges from './gameChanges';

// reducer
export default combineReducers({
  login: login,
  board: board,
  display: display,
  gameChanges: gameChanges
});
