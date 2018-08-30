// available actions
export const DISPLAY_GAMEBOARD_SET = 'wordgrid2/display/DISPLAY_GAMEBOARD_SET';

// initial state
const initialState = {
  gameBoard: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
}

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DISPLAY_GAMEBOARD_SET:
      return {...state, gameBoard: action.gameBoard}
    default:
      return state;
  }
}

// action creators
export function setGameboardLocation(x, y, width, height) {
  return {
    type: DISPLAY_GAMEBOARD_SET,
    gameBoard: {x: x, y: y, width: width, height: height}
  };
}