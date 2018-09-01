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
  pieces: {
    one: [
      ["p", "o", "p", "s"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    two: [
      ["", "o", "p", "s"],
      ["", "q", "", ""],
      ["", "z", "", ""],
      ["", "", "", ""],
    ],
    three: [
      ["p", "o", "", ""],
      ["p", "", "", ""],
      ["t", "", "", ""],
      ["k", "", "", ""],
    ]

  }
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PLACE_PIECE:
      return state;
    default:
      return state;
  }
}

// action creators
export function placeLetters(letters = []) {

}