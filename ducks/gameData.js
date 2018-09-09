// available actions
export const PLACE_PIECE = 'wordgrid2/gameData/PLACE_PIECE';
export const CONSUME_SQUARE = 'wordgrid2/gameData/CONSUME_SQUARE';
export const REMOVE_SQUARE = 'wordgrid2/gameData/REMOVE_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CLEAR_CONSUMED_SQUARES';

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PLACE_PIECE:

      return gameReducer(state, action);
    case CONSUME_SQUARE:
      return {...state, consumedSquares: state.consumedSquares.concat(action.square)};
    case REMOVE_SQUARE:
      return {...state, consumedSquares: state.consumedSquares.slice(0, state.consumedSquares.length - 1)};
    case CLEAR_CONSUMED_SQUARES:
      return {...state, consumedSquares: []};
    default:
      return state;
  }
}

function gameReducer(state, action) {
  const rows = action.rows;
  const games = state.games;
  const byID = state.games.byID;
  const game = state.games.byID[action.gameID];
  console.log('1: ', rows);
  console.log('2: ', games);
  console.log('3: ', byID);
  console.log('id: ', action.gameID);
  console.log('4: ', game);
  const pieces = [...game.pieces.slice(0, action.pieceIndex), ...game.pieces.slice(action.pieceIndex + 1), []];
  console.log('pieces: ', pieces);
  return {
    ...state,
    games: {
      ...games,
      byID: {
        ...byID,
        [action.gameID]: {...game, rows, pieces}
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

export function consumeSquare(square) {
  return {
    type: CONSUME_SQUARE,
    square
  }
}

export function removeSquare() {
  return {
    type: REMOVE_SQUARE
  }
}

export function clearConsumedSquares() {
  return {
    type: CLEAR_CONSUMED_SQUARES
  }
}

// initial state
const game1 = {
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
  consumedSquares: [],
  rows: [
    ["a", "b", "c", "", "", "d", "e", "f", "g", ""],
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
  ],
  games: {
    byID: {
      1: game1,
      2: game2
    },
    allIDs: [
      {id: "1", name:"nicholas"},
      {id: "2", name: "cage" }
    ],
  },
};