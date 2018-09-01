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
      ["p", "o", "p", "s"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    three: [
      ["p", "o", "p", "s"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
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