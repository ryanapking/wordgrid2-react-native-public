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

  const boardStates = {
    start: boardStringToArray(start.b),
    end: boardStringToArray(end.b),
  };

  const pieceStates = {
    start: start[player].map( (piece) => pieceStringToArray(piece)),
    end: end[player].map( (piece) => pieceStringToArray(piece)),
  };

  const pr = end.pr.split("|");
  const placementRef = {
    pieceIndex: pr[0],
    rowIndex: pr[1],
    columnIndex: pr[2]
  };

  const wp = end.wp.split("|");
  const wordPath = wp.map( (coordinateSet) => {
    const squareCoordinates = coordinateSet.split(",");
    return {
      rowIndex: squareCoordinates[0],
      columnIndex: squareCoordinates[1]
    };
  });

  return {
    boardStates,
    pieceStates,
    placementRef,
    wordPath
  };

}