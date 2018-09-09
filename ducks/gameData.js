// available actions
export const PLACE_PIECE = 'wordgrid2/gameData/PLACE_PIECE';
export const CONSUME_SQUARE = 'wordgrid2/gameData/CONSUME_SQUARE';
export const REMOVE_SQUARE = 'wordgrid2/gameData/REMOVE_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CLEAR_CONSUMED_SQUARES';

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PLACE_PIECE:
      return placePieceReducer(state, action);
    case CONSUME_SQUARE:
      return consumeSquareReducer(state, action);
    case REMOVE_SQUARE:
      return removeSquareReducer(state, action);
    case CLEAR_CONSUMED_SQUARES:
      return clearConsumedSquareReducer(state, action);
    default:
      return state;
  }
}

function placePieceReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  const rows = action.rows;
  const pieces = [...game.pieces.slice(0, action.pieceIndex), ...game.pieces.slice(action.pieceIndex + 1), []];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {...game, rows, pieces}
    }
  };
}

function consumeSquareReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  const consumedSquares = game.consumedSquares.concat(action.square);
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        consumedSquares
      }
    }
  };
}

function removeSquareReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  const consumedSquares = game.consumedSquares.slice(0, game.consumedSquares.length - 1);
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        consumedSquares
      }
    }
  };
}

function clearConsumedSquareReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  const consumedSquares = [];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        consumedSquares
      }
    }
  };
}

// action creators
export function placePiece(rows = [], pieceIndex, gameID) {
  return {
    type: PLACE_PIECE,
    rows: rows,
    pieceIndex,
    gameID
  }
}

export function consumeSquare(square, gameID) {
  return {
    type: CONSUME_SQUARE,
    square,
    gameID
  }
}

export function removeSquare(gameID) {
  return {
    type: REMOVE_SQUARE,
    gameID
  }
}

export function clearConsumedSquares(gameID) {
  return {
    type: CLEAR_CONSUMED_SQUARES,
    gameID
  }
}

// initial state
const game1 = {
  consumedSquares: [],
  rows: [
    ["g", "a", "m", "e", "", "o", "n", "e", "", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
  ],
  pieces: [
    [
      ["p", "", "", ""],
      ["l", "", "", ""],
      ["u", "", "", ""],
      ["g", "", "", ""],
    ],
    [
      ["", "o", "", ""],
      ["", "q", "", ""],
      ["", "z", "", ""],
      ["", "c", "", ""],
    ],
    [
      ["p", "o", "", ""],
      ["p", "", "", ""],
      ["t", "", "", ""],
      ["k", "", "", ""],
    ]
  ]
}

const game2 = {
  consumedSquares: [],
  rows: [
    ["g", "a", "m", "e", "", "t", "w", "o", "", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
  ],
  pieces: [
    [
      ["p", "", "", ""],
      ["l", "", "", ""],
      ["u", "", "", ""],
      ["g", "", "", ""],
    ],
    [
      ["", "o", "", ""],
      ["", "q", "", ""],
      ["", "z", "", ""],
      ["", "c", "", ""],
    ],
    [
      ["p", "o", "", ""],
      ["p", "", "", ""],
      ["t", "", "", ""],
      ["k", "", "", ""],
    ]
  ]
}

const initialState = {
  byID: {
    1: game1,
    2: game2
  },
  allIDs: [
    {id: "1", name:"nicholas"},
    {id: "2", name: "cage" }
  ],
};