import { challengeRemoteToLocal, calculateWordValue, wordPathArrayToString } from "../utilities";
import english from '../utilities/english';

// available actions
const CHALLENGE_SET_SOURCE_DATA = 'wordgrid2/gameData/CHALLENGE_SET_SOURCE_DATA';
const CHALLENGE_SET_LOCAL_DATA = 'wordgrid2/gameData/CHALLENGE_SET_LOCAL_DATA';
const CHALLENGE_CONSUME_SQUARE = 'wordgrid2/gameData/CHALLENGE_CONSUME_SQUARE';
const CHALLENGE_REMOVE_SQUARE = 'wordgrid2/gameData/CHALLENGE_REMOVE_SQUARE';
const CHALLENGE_CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CHALLENGE_CLEAR_CONSUMED_SQUARES';
const CHALLENGE_PLAY_WORD = 'wordgrid2/gameData/CHALLENGE_PLAY_WORD';

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
    case CHALLENGE_PLAY_WORD:
      return playWordReducer(state, action);
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

function playWordReducer(state, action) {
  return {
    ...state,
    challenge: {
      ...state.challenge,
      word: action.word,
      wordValue: action.wordValue,
      wordPath: action.wordPath,
      consumedSquares: [],
      rows: action.newRows,
    }
  }
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

export function playWord() {
  return (dispatch, getState) => {
    const { challengeData } = getState();
    const { challenge } = challengeData;
    const word = challenge.consumedSquares.reduce( (word, square) => word + square.letter, "");
    if (word.length >=4 && english.contains(word)) {
      const wordValue = calculateWordValue(word);
      const wordPath = wordPathArrayToString(challenge.consumedSquares);

      const newRows = challenge.rows.map( (row, rowIndex ) => {
        return row.map( (letter, columnIndex) => {
          const letterPlayed = challenge.consumedSquares.reduce( (found, square) => found || (square.rowIndex === rowIndex && square.columnIndex === columnIndex), false );
          return letterPlayed ? "" : letter;
        });
      });

      dispatch({
        type: CHALLENGE_PLAY_WORD,
        word,
        wordPath,
        wordValue,
        newRows,
      });
    }
  };
}