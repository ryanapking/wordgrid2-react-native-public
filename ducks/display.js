// available actions
export const DISPLAY_GAMEBOARD_SET = 'wordgrid2/display/DISPLAY_GAMEBOARD_SET';

// initial state
const initialState = {
  gameBoard: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rowBounds: [],
    columnBounds: []
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
  const rowHeight = height / 10;
  const columnWidth = width / 10;

  const rowBounds = Array(10).fill(1).map( (val, index) => {
    const minY = y + (index * rowHeight);
    const maxY = minY + rowHeight;
    return {minY, maxY};
  });

  const columnBounds = Array(10).fill(1).map( (val, index) => {
    const minX = x + (index * columnWidth);
    const maxX = minX + columnWidth;
    return {minX, maxX};
  });

  return {
    type: DISPLAY_GAMEBOARD_SET,
    gameBoard: { x, y, width, height, rowBounds, columnBounds }
  };
}