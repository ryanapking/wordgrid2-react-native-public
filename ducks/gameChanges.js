// action types
export const CONSUME_SQUARE = 'wordgrid2/gamechanges/CONSUME_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gamechanges/CLEAR_CONSUMED_SQUARES'

// inital state
const initialState = {
  consumedSquares: []
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CONSUME_SQUARE:
      return {...state, consumedSquares: state.consumedSquares.concat(action.square)};
    case CLEAR_CONSUMED_SQUARES:
      return {...state, consumedSquares: []};
    default:
      return state;
  }
}

// action creators
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