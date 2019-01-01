import { challengeRemoteToLocal, challengeMoveToHistory, calculateWordValue, wordPathArrayToString } from "../utilities";
import english from '../utilities/english';

// available actions
const CHALLENGE_SET_SOURCE_DATA = 'wordgrid2/challengeData/CHALLENGE_SET_SOURCE_DATA';
const CHALLENGE_SET_LOCAL_DATA = 'wordgrid2/challengeData/CHALLENGE_SET_LOCAL_DATA';
const CHALLENGE_CONSUME_SQUARE = 'wordgrid2/challengeData/CHALLENGE_CONSUME_SQUARE';
const CHALLENGE_REMOVE_SQUARE = 'wordgrid2/challengeData/CHALLENGE_REMOVE_SQUARE';
const CHALLENGE_CLEAR_CONSUMED_SQUARES = 'wordgrid2/challengeData/CHALLENGE_CLEAR_CONSUMED_SQUARES';
const CHALLENGE_PLAY_WORD = 'wordgrid2/challengeData/CHALLENGE_PLAY_WORD';
const CHALLENGE_PLACE_PIECE = 'wordgrid2/challengeData/CHALLENGE_PLACE_PIECE';

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
    case CHALLENGE_PLACE_PIECE:
      return placePieceReducer(state, action);
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

function placePieceReducer(state, action) {
  return {
    ...state,
    challenge: {
      ...state.challenge,
      word: null,
      wordPath: null,
      wordValue: null,
      pieces: action.pieces,
      history: action.history,
      rows: action.rows,
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

export function placePiece(pieceIndex, rowRef, columnRef) {
  return (dispatch, getState) => {
    const { challengeData } = getState();
    const { challenge } = challengeData;
    const piece = challenge.pieces[pieceIndex];
    const placementRef = [pieceIndex, rowRef, columnRef].join("|");

    // make a full copy of the current rows to manipulate
    let newRows = challenge.rows.map( (row) => [...row] );

    // add the letters to the rows copy
    piece.forEach((row, rowIndex) => {
      row.forEach((letter, columnIndex) => {
        const boardRow = rowRef + rowIndex;
        const boardColumn = columnRef + columnIndex;
        if (letter) {
          newRows[boardRow][boardColumn] = letter;
        }
      });
    });

    // remove the played piece and add the next piece
    const remainingPieces = challenge.pieces.filter( (piece, currentPieceIndex) => currentPieceIndex !== parseInt(pieceIndex));
    const nextPiece = challenge.pieceBank[challenge.word.length].pop(); // not cool to alter piecebank here, but it will be manipulated in no other way
    const pieces = [...remainingPieces, nextPiece];

    // create new item to save to history
    const newHistoryItem = challengeMoveToHistory({...challenge, rows: newRows}, placementRef);
    const history = [...challenge.history, newHistoryItem];

    dispatch({
      type: CHALLENGE_PLACE_PIECE,
      rows: newRows,
      pieceIndex,
      placementRef,
      pieces,
      history,
    });
  };
}