import firebase from 'react-native-firebase';

import { remoteToLocal, calculateWordValue } from '../utilities';

// available actions
// game actions
export const PLACE_PIECE = 'wordgrid2/gameData/PLACE_PIECE';
export const CONSUME_SQUARE = 'wordgrid2/gameData/CONSUME_SQUARE';
export const REMOVE_SQUARE = 'wordgrid2/gameData/REMOVE_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CLEAR_CONSUMED_SQUARES';
export const SET_OPPONENT_NAME = 'wordgrid2/gameData/SET_OPPONENT_NAME';
export const ADD_OPPONENT_PIECE = 'wordgrid2/gameData/ADD_OPPONENT_PIECE';
export const SET_BOARD_ROWS = 'wordgrid2/gameData/SET_BOARD_ROWS';
export const PLAY_WORD = 'wordgrid2/gameData/PLAY_WORD';

// syncing actions
export const SET_LOCAL_GAME_IDS = 'wordgrid2/gameData/SET_LOCAL_GAME_IDS';
export const SET_LOCAL_GAME_BY_ID = 'wordgrid2/gameData/SET_LOCAL_GAME_BY_ID';
export const REMOVE_LOCAL_GAME_BY_ID = 'wordgrid2/gameData/REMOVE_LOCAL_GAME_BY_ID';

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
    case SET_LOCAL_GAME_IDS:
      return setLocalGameIDsReducer(state, action);
    case SET_LOCAL_GAME_BY_ID:
      return setLocalGameDataReducer(state, action);
    case SET_OPPONENT_NAME:
      return setOpponentNameReducer(state, action);
    case REMOVE_LOCAL_GAME_BY_ID:
      return removeLocalGameByIDReducer(state, action);
    case ADD_OPPONENT_PIECE:
      return addOpponentPieceReducer(state, action);
    case SET_BOARD_ROWS:
      return setBoardRowsReducer(state, action);
    case PLAY_WORD:
      return playWordReducer(state, action);
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

function setLocalGameIDsReducer(state, action) {
  const allIDs = action.gameIDs;
  return {
    ...state,
    allIDs
  }
}

function setLocalGameDataReducer(state, action) {
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

function removeLocalGameByIDReducer(state, action) {
  let byID = {...state.byID};
  delete byID[action.gameID];
  return {
    ...state,
    byID
  }
}

function addOpponentPieceReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        them: action.pieces
      }
    }
  };
}

function setBoardRowsReducer(state, action) {
  const byID = state.byID;
  const game = state.byID[action.gameID];
  return {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: {
        ...game,
        rows: action.rows,
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
        consumedSquares: [],
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

export function setLocalGameIDs(gameIDs) {
  return {
    type: SET_LOCAL_GAME_IDS,
    gameIDs
  }
}

export function setLocalGameDataByID(gameID, userID, sourceData) {
  const localData = remoteToLocal(sourceData, userID);
  return {
    type: SET_LOCAL_GAME_BY_ID,
    localData,
    gameID
  }
}

export function setOpponentName(gameID, opponentName) {
  return {
    type: SET_OPPONENT_NAME,
    gameID,
    opponentName
  }
}

export function removeLocalGameByID(gameID) {
  return {
    type: REMOVE_LOCAL_GAME_BY_ID,
    gameID
  }
}

export function addOpponentPiece(gameID, pieces) {
  return {
    type: ADD_OPPONENT_PIECE,
    gameID,
    pieces
  };
}

export function setBoardRows(gameID, rows) {
  return {
    type: SET_BOARD_ROWS,
    gameID,
    rows
  }
}

export function playWord(gameID, word, wordValue) {
  return {
    type: PLAY_WORD,
    gameID,
    word,
    wordValue
  }
}