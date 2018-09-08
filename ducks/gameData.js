// available actions
export const PLACE_PIECE = 'wordgrid2/gameData/PLACE_PIECE';
export const CONSUME_SQUARE = 'wordgrid2/gameData/CONSUME_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CLEAR_CONSUMED_SQUARES';

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PLACE_PIECE:
      return {...state, rows: action.rows, pieces: [...state.pieces.slice(0, action.pieceIndex), ...state.pieces.slice(action.pieceIndex + 1), []]};
    case CONSUME_SQUARE:
      return {...state, consumedSquares: state.consumedSquares.concat(action.square)};
    case CLEAR_CONSUMED_SQUARES:
      return {...state, consumedSquares: []};
    default:
      return state;
  }
}

// action creators
export function placePiece(rows = [], pieceIndex) {
  return {
    type: PLACE_PIECE,
    rows: rows,
    pieceIndex
  }
}

export function consumeSquare(square) {
  return {
    type: CONSUME_SQUARE,
    square
  }
}

export function clearConsumedSquares() {
  return {
    type: CLEAR_CONSUMED_SQUARES
  }
}

// initial state
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
  ]
};