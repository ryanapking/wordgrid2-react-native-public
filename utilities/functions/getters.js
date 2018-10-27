import settings from '../config';
import { boardStringToArray, pieceStringToArray } from "./dataConversions";

// return a dumb object of scores as if they are baseball innings
export function getScoreBoard(game) {

  const emptyScoreObject = { p1: null, p2: null };

  const scores = game.h.reduce( (scores, move) => {

    let previousMove = scores[scores.length - 1];

    const lastScoreIndex = scores.length - 1;
    let player = null;

    if (!move.p) {
      return scores;
    } else if (move.p === game.p1) {
      player = "p1";
    } else if (move.p === game.p2) {
      player = "p2";
    } else {
      console.log('something is busted');
      return scores;
    }

    if (previousMove[player]) {
      return [
        ...scores,
        {...emptyScoreObject, [player]: move.wv }
      ];
    } else {
      scores[lastScoreIndex] = {...previousMove, [player]: move.wv};
      return scores;
    }

  }, [emptyScoreObject]);

  // if we are short, fill out the difference with empty inning objects
  // this allows the scoreboard to go into extra innings and also display the remaining moves
  const remainingTurnCount = settings.naturalTurns - scores.length;
  if (remainingTurnCount > 0) {
    let diffMakerUpper = new Array(remainingTurnCount).fill(emptyScoreObject);
    return [...scores, ...diffMakerUpper];
  } else {
    return scores;
  }

}

export function getAnimationData(game) {
  if (game.history.length < 1) return false;

  const start = game.history[game.history.length -2];
  const end = game.history[game.history.length - 1];
  const player = (end.p === game.p1) ? "p1" : "p2";

  const pieceStates = {
    start: start[player].map( (piece) => pieceStringToArray(piece)),
    end: end[player].map( (piece) => pieceStringToArray(piece)),
  };

  const pr = end.pr.split("|");
  const placementRef = {
    pieceIndex: parseInt(pr[0]),
    rowIndex: parseInt(pr[1]),
    columnIndex: parseInt(pr[2])
  };

  let boardStates = {
    start: boardStringToArray(start.b),
    end: boardStringToArray(end.b),
  };

  boardStates.between = getBoardMinusPiece(boardStates.end, pieceStates.start, placementRef);

  console.log('boardStates:', boardStates);

  const wp = end.wp.split("|");
  const wordPath = wp.map( (coordinateSet) => {
    const squareCoordinates = coordinateSet.split(",");
    return {
      rowIndex: parseInt(squareCoordinates[0]),
      columnIndex: parseInt(squareCoordinates[1])
    };
  });

  return {
    boardStates,
    pieceStates,
    placementRef,
    wordPath
  };

}

function getBoardMinusPiece(boardArray, pieces, placementRef) {
  const piece = pieces[placementRef.pieceIndex];

  // create a copy of the board array
  let newBoardArray = boardArray.map( (row) => row.slice() );

  // remove each letter of the piece from the new board array
  piece.forEach( (row, rowIndex) => {
    row.forEach( (letter, columnIndex) => {
      if (letter) {
        const boardRowIndex = placementRef.rowIndex + rowIndex;
        const boardColumnIndex = placementRef.columnIndex + columnIndex;
        newBoardArray[boardRowIndex][boardColumnIndex] = "";
      }
    });
  });

  return newBoardArray;
}