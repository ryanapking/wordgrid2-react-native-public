import firebase from 'react-native-firebase';

import { remoteToLocal, calculateWordValue } from '../utilities';

// available actions
// game actions
export const PLACE_PIECE = 'wordgrid2/gameData/PLACE_PIECE';
export const CONSUME_SQUARE = 'wordgrid2/gameData/CONSUME_SQUARE';
export const REMOVE_SQUARE = 'wordgrid2/gameData/REMOVE_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CLEAR_CONSUMED_SQUARES';
export const PLAY_WORD = 'wordgrid2/gameData/PLAY_WORD';
export const PLAY_WORD_STARTED = 'wordgrid2/gameData/PLAY_WORD_STARTED';
export const PLAY_WORD_ENDED = 'wordgrid2/gameData/PLAY_WORD_ENDED';
export const SET_OPPONENT_NAME = 'wordgrid2/gameData/SET_OPPONENT_NAME';

// syncing actions
export const SET_LOCAL_GAME_IDS = 'wordgrid2/gameData/SET_LOCAL_GAME_IDS';
export const SET_LOCAL_GAME_BY_ID = 'wordgrid2/gameData/SET_LOCAL_GAME_BY_ID';

// initial state
const initialState = {
  byID: {},
  allIDs: [],
};

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
    case SET_LOCAL_GAME_IDS:
      return updateLocalGameIDsReducer(state, action);
    case SET_LOCAL_GAME_BY_ID:
      return updateLocalGameReducer(state, action);
    case SET_OPPONENT_NAME:
      return setOpponentNameReducer(state, action);
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
        wordValue: action.wordValue,
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

function updateLocalGameIDsReducer(state, action) {
  const allIDs = action.gameIDs;
  return {
    ...state,
    allIDs
  }
}

function updateLocalGameReducer(state, action) {
  const byID = state.byID;
  let newState = {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: action.localData
    },
  };

  // console.log("new state:", newState);

  return newState;
}

function setOpponentNameReducer(state, action) {
  console.log('setOpponentNameReducer');
  const byID = state.byID;
  const game = state.byID[action.gameID];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        opponentName: action.opponentName
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
  const wordValue = calculateWordValue(word);

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
    wordValue,
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

export function updateLocalGameIDs(gameIDs) {
  return {
    type: SET_LOCAL_GAME_IDS,
    gameIDs
  }
}

export function updateLocalGame(gameID, userID, sourceData) {
  const localData = remoteToLocal(sourceData, userID);
  return {
    type: SET_LOCAL_GAME_BY_ID,
    localData,
    gameID
  }
}

export function getOpponentName(gameID) {

  return (dispatch, getState) => {

    const state = getState();
    const game = state.gameData.byID[gameID];
    const opponentID = game.opponentID;

    if (!opponentID) return;

    firebase.firestore().collection('displayNames')
      .where("id", "==", opponentID)
      .limit(1)
      .get()
      .then( (results) => {
        // console.log('name search complete');
        if (results.docs.length > 0) {
          dispatch(setOpponentName(gameID, results.docs[0].id));
        }
      })
      .catch( (err) => {
        console.log('error fetching opponent:', err);
      })
      .finally( () => {
        // console.log('finally...');
      })
  }
}

export function setOpponentName(gameID, opponentName) {
  return {
    type: SET_OPPONENT_NAME,
    gameID,
    opponentName
  }
}