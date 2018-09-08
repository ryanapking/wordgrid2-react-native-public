import { combineReducers } from 'redux';

import login from './login';
import gameData from './gameData';
import gameDisplay from './gameDisplay';

// reducer
export default combineReducers({
  login: login,
  gameDisplay: gameDisplay,
  gameData: gameData
});
