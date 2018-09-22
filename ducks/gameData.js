import firebase from 'react-native-firebase';

import { remoteToLocal } from '../utilities';

// available actions
// game actions
export const PLACE_PIECE = 'wordgrid2/gameData/PLACE_PIECE';
export const CONSUME_SQUARE = 'wordgrid2/gameData/CONSUME_SQUARE';
export const REMOVE_SQUARE = 'wordgrid2/gameData/REMOVE_SQUARE';
export const CLEAR_CONSUMED_SQUARES = 'wordgrid2/gameData/CLEAR_CONSUMED_SQUARES';
export const PLAY_WORD = 'wordgrid2/gameData/PLAY_WORD';
export const PLAY_WORD_STARTED = 'wordgrid2/gameData/PLAY_WORD_STARTED';
export const PLAY_WORD_ENDED = 'wordgrid2/gameData/PLAY_WORD_ENDED';

// data manipulation
export const UPDATE_LOCAL_GAME_IDS = 'wordgrid2/gameData/UPDATE_LOCAL_GAME_IDS';
export const UPDATE_REMOTE_SYNCING_IDS = 'wordgrid2/gameData/UPDATE_REMOTE_SYNCING_IDS';
export const UPDATE_LOCAL_GAME = 'wordgrid2/gameData/UPDATE_LOCAL_GAME';

// initial state
const initialState = {
  sourceDataByID: {},
  byID: {},
  allIDs: [],
  gameListeners: [],
  userListener: null
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
    case UPDATE_LOCAL_GAME_IDS:
      return updateLocalGameIDsReducer(state, action);
    case UPDATE_REMOTE_SYNCING_IDS:
      return updateRemoteSyncingIDsReducer(state, action);
    case UPDATE_LOCAL_GAME:
      return updateLocalGameReducer(state, action);
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

function updateLocalGameIDsReducer(state, action) {
  const allIDs = action.gameIDs;
  return {
    ...state,
    allIDs
  }
}

function updateRemoteSyncingIDsReducer(state, action) {
  return {
    ...state,
    gameListeners: action.gameListeners
  }
}

function updateLocalGameReducer(state, action) {
  const byID = state.byID;
  const sourceDataByID = state.sourceDataByID;
  let newState = {
    ...state,
    byID: {
      ...byID,
      [action.gameID]: action.localData
    },
    sourceDataByID: {
      ...sourceDataByID,
      [action.gameID]: action.sourceData
    }
  };

  console.log("new state:", newState);

  return newState;
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

export function remoteSaveGame(userID, newGameData) {
  // save a game (initial save only) remotely from local data

  const userDocRef = firebase.firestore().collection('users').doc(userID);
  const newGameDocRef = firebase.firestore().collection('games').doc();
  const newGameID = { id: newGameDocRef.id, name: newGameDocRef.id };

  return (dispatch) => {

    firebase.firestore().runTransaction( (transaction) => {

      return transaction.get(userDocRef).then( (userDoc) => {

        if (!userDoc.exists) return;

        const currentUserGames = userDoc.data().games ? userDoc.data().games : [];

        transaction.update(userDocRef, {
          games: [ ...currentUserGames, newGameID ]
        });

        transaction.set(newGameDocRef, newGameData );

        console.log('gameDocRef:', newGameDocRef);


      });

    }).then( () => {
      console.log('sweet game save successsssss');
    }).catch( (err) => {
      console.log('error:', err);
    });

  }

}

export function remoteUpdateGame(gameID, userID, localGameData) {
  // update a remote game from local data
  return {
    type: REMOTE_UPDATE_GAME
  }
}

function updateLocalGameIDs(gameIDs) {
  return {
    type: UPDATE_LOCAL_GAME_IDS,
    gameIDs
  }
}

export function startRemoteIDSync(userID) {
  // console.log('sync started');
  const userDocRef = firebase.firestore().collection('users').doc(userID);

  return (dispatch) => {
    userDocRef.onSnapshot( (userDoc) => {

      if (!userDoc.exists) return;

      const gameIDs = userDoc.data().games ? userDoc.data().games : [];

      dispatch(updateLocalGameIDs(gameIDs));
      dispatch(startRemoteGameSyncs(gameIDs));

      // console.log('from sync: userDoc:', userDoc.data());

    });

  }
}

export function startRemoteGameSyncs(gameIDs) {

  return (dispatch, getState) => {

    // remove the non-firebase uuid stuff
    const currentRemoteGameIDs = gameIDs.map( (gameID) => {
      return gameID.id;
    });

    // grab the already present listeners, to prevent duplicates
    const alreadyListening = getState().gameData.gameListeners;

    // figure out which new listeners would be duplicates
    // add the other listeners
    currentRemoteGameIDs.filter( (gameID) => {
      return !alreadyListening.includes(gameID);
    }).forEach( (gameID) => {

      console.log('starting sync for new game:', gameID);
      const gameDocRef = firebase.firestore().collection('games').doc(gameID);
      gameDocRef.onSnapshot( (gameDoc) => {

        if (!gameDoc.exists) return;
        dispatch(updateLocalGame(gameID, gameDoc.data()));

      });

    });

    dispatch(updateRemoteSyncingIDs(currentRemoteGameIDs));

  }
}

export function updateRemoteSyncingIDs(gameIDs) {
  return {
    type: UPDATE_REMOTE_SYNCING_IDS,
    gameListeners: gameIDs
  }
}

export function updateLocalGame(gameID, sourceData) {
  return {
    type: UPDATE_LOCAL_GAME,
    localData: remoteToLocal(sourceData),
    sourceData,
    gameID
  }
}