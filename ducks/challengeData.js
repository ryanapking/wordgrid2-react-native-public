import { challengeRemoteToLocal } from "../utilities";

// available actions
const CHALLENGE_SET_SOURCE_DATA = 'wordgrid2/gameData/CHALLENGE_SET_SOURCE_DATA';
const CHALLENGE_SET_LOCAL_DATA = 'wordgrid2/gameData/CHALLENGE_SET_LOCAL_DATA';
const CHALLENGE_CONSUME_SQUARE = 'wordgrid2/gameData/CHALLENGE_CONSUME_SQUARE';
const CHALLENGE_REMOVE_SQUARE = 'wordgrid2/gameData/CHALLENGE_REMOVE_SQUARE';
const CHALLENGE_CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CHALLENGE_CLEAR_CONSUMED_SQUARES';

const initialState = {
  source: null,
  challenge: null,
};

// reducer manager
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHALLENGE_SET_SOURCE_DATA:
      return { ...state, source: action.sourceChallengeData };
    case CHALLENGE_SET_LOCAL_DATA:
      return { ...state, challenge: action.challenge };
    case CHALLENGE_CONSUME_SQUARE:
      return consumeSquareReducer(state, action);
    case CHALLENGE_REMOVE_SQUARE:
      return removeSquareReducer(state, action);
    case CHALLENGE_CLEAR_CONSUMED_SQUARES:
      return clearConsumedSquareReducer(state, action);
    default:
      return state;
  }
}

// reducers
function consumeSquareReducer(state, action) {
  return {
    ...state,
    challenge: {
      ...state.challenge,
      consumedSquares: state.challenge.consumedSquares.concat(action.square),
    },
  };
}

function removeSquareReducer(state, action) {
  return {
    ...state,
    challenge: {
      ...state.challenge,
      consumedSquares: state.challenge.consumedSquares.slice(0, state.challenge.consumedSquares.length - 1),
    },
  };
}

function clearConsumedSquareReducer(state, action) {
  return {
    ...state,
    challenge: {
      ...state.challenge,
      consumedSquares: [],
    },
  };
}

// action creators
export function setSourceChallengeData(sourceChallengeData) {
  return {
    type: CHALLENGE_SET_SOURCE_DATA,
    sourceChallengeData,
  };
}

export function setLocalChallengeData(sourceChallengeData) {
  return {
    type: CHALLENGE_SET_LOCAL_DATA,
    challenge: challengeRemoteToLocal(sourceChallengeData),
  };
}

export function startChallenge() {
  return (dispatch, getState) => {
    const { challengeData } = getState();
    if (challengeData.source) {
      dispatch(setLocalChallengeData(challengeData.source));
    }
  };
}

export function consumeSquare(square) {
  return {
    type: CHALLENGE_CONSUME_SQUARE,
    square,
  };
}

export function removeSquare() {
  return {
    type: CHALLENGE_REMOVE_SQUARE,
  };
}

export function clearConsumedSquares() {
  return {
    type: CHALLENGE_CLEAR_CONSUMED_SQUARES,
  };
}