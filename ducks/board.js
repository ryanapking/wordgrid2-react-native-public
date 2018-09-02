// available actions
export const PLACE_PIECE = 'wordgrid2/board/PLACE_PIECE';

// initial state
const initialState = {
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

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PLACE_PIECE:
      return {...state, rows: action.rows, pieces: [...state.pieces.slice(0, action.pieceIndex), ...state.pieces.slice(action.pieceIndex + 1), []]};
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