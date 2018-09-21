import firebase from 'react-native-firebase';
import * as sampleData from './sampleData';

// available actions
export const PLACE_PIECE = 'wordgrid2/gameData/PLACE_PIECE';
export const CONSUME_SQUARE = 'wordgrid2/gameData/CONSUME_SQUARE';
export const REMOVE_SQUARE = 'wordgrid2/gameData/REMOVE_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CLEAR_CONSUMED_SQUARES';
export const PLAY_WORD = 'wordgrid2/gameData/PLAY_WORD';
export const PLAY_WORD_STARTED = 'wordgrid2/gameData/PLAY_WORD_STARTED';
export const PLAY_WORD_ENDED = 'wordgrid2/gameData/PLAY_WORD_ENDED';
export const CREATE_GAME = 'wordgrid2/gameData/CREATE_GAME';


// reducer manager
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
    case PLAY_WORD_STARTED:
      return startPlayWordReducer(state, action);
    case PLAY_WORD_ENDED:
      return endPlayWordReducer(state, action);
    case PLAY_WORD:
      return playWordReducer(state, action);
    case CREATE_GAME:
      return createGameReducer(state, action);
    default:
      return state;
  }
}

// individual reducer functions
function placePieceReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  const rows = action.rows;
  const me = [...game.me.slice(0, action.pieceIndex), ...game.me.slice(action.pieceIndex + 1), []];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        rows,
        me,
        piecePlaced: true
      },
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

function playWordReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        word: action.word,
        rows: action.rows,
        consumedSquares: [],
        validatingWord: false
      }
    }
  };
}

function endPlayWordReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        validatingWord: false,
        consumedSquares: []
      }
    }
  };
}

function startPlayWordReducer(state, action) {
  console.log('play started reducer');
  const byID = state.byID;
  const game = state.byID[action.gameID];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        validatingWord: true
      }
    }
  };
}

function createGameReducer(state, action) {
  console.log('create game reducer');
  const byID = state.byID;
  const allIDs = state.allIDs;
  const sourceDataByID = state.sourceDataByID;
  return {
    ...state,
    allIDs: [
      ...allIDs,
      {id: action.gameID, name: "broseph"}
    ],
    byID: {
      ...byID,
      [action.gameID]: 'this is a string that is something!'
    },
    sourceDataByID: {
      ... sourceDataByID,
      [action.gameID]: 'this is another string!'
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

export function startPlayWord(gameID) {
  return {
    type: PLAY_WORD_STARTED,
    gameID
  }
}

export function endPlayWord(gameID) {
  return {
    type: PLAY_WORD_ENDED,
    gameID
  }
}

export function playValidatedWord(consumedSquares, rows, gameID) {
  // build the word from the consumed squares
  const word = consumedSquares.reduce( (word, square) => word + square.letter, "");

  // map the played squares onto the board
  const newRows = rows.map( (row, rowIndex ) => {
    return row.map( (letter, columnIndex) => {
      const letterPlayed = consumedSquares.reduce( (found, square) => found || (square.rowIndex === rowIndex && square.columnIndex === columnIndex), false );
      return letterPlayed ? "" : letter;
    });
  });

  return {
    type: PLAY_WORD,
    rows: newRows,
    word,
    gameID
  }
}

export function playWord(consumedSquares, rows, gameID) {
  const word = consumedSquares.reduce( (word, square) => word + square.letter, "");

  // check if the word is valid and dispatch the appropriate action
  return (dispatch) => {

    dispatch(startPlayWord(gameID));

    firebase.firestore().collection('dictionary').doc(word).get()
      .then((doc) => {
        console.log(`${word} exists? ${doc.exists}`);

        if (doc.exists) {
          dispatch(playValidatedWord(consumedSquares, rows, gameID));
        } else {
          dispatch(endPlayWord(gameID));
        }

      })
      .catch((e) => {
        console.log("error fetching doc:", e);
      });
  };
}

export function createGame(gameState, gameID) {
  return {
    type: CREATE_GAME,
    gameID,
    gameState
  }
}

// initial state
const initialState = {
  sourceDataByID: {
    1: sampleData.game1Source,
    2: sampleData.game2Source
  },
  byID: {
    1: sampleData.game1Local,
    2: sampleData.game2Local
  },
  allIDs: [
    {id: "1", name:"nicholas"},
    {id: "2", name: "cage" }
  ],
};

// console.log('initial state: ', initialState);