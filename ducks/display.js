// available actions
export const DISPLAY_GAMEBOARD_SET = 'wordgrid2/display/DISPLAY_GAMEBOARD_SET';
export const DISPLAY_SET_SPELLED_WORD = 'wordgrid2/display/DISPLAY_SET_SPELLED_WORD';

// initial state
const initialState = {
  gameBoard: {
    // game board variables
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // column variables
    rowHeight: 0,
    columnWidth: 0,
    rowMidPoints: [],
    columnMidPoints: [],
  },
  displayWord: ""
}

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DISPLAY_GAMEBOARD_SET:
      return {...state, gameBoard: action.gameBoard}
    case DISPLAY_SET_SPELLED_WORD:
      return {...state, displayWord: action.displayWord}
    default:
      return state;
  }
}

// action creators
export function setGameboardLocation(x, y, width, height) {
  const rowHeight = height / 10;
  const columnWidth = width / 10;

  const rowMidPoints = Array(10).fill(1).map( (val, index) => {
    return (y + (rowHeight * index) + (rowHeight / 2));
  });

  const columnMidPoints = Array(10).fill(1).map( (val, index) => {
    return (x + (columnWidth * index) + (columnWidth / 2));
  });

  return {
    type: DISPLAY_GAMEBOARD_SET,
    gameBoard: { x, y, width, height, rowMidPoints, columnMidPoints, rowHeight, columnWidth }
  };
}

export function setDisplayWord(displayWord) {
  return {
    type: DISPLAY_SET_SPELLED_WORD,
    displayWord: displayWord
  }
}