export function getPlayerMoveScores(game) {
  let startingScores = { p1: [], p2: []};

  return game.history.reduce( (score, move) => {
    if (move.p && move.p === game.p1) {
      return { p1: [...score.p1, move.p], p2: [...score.p2]};
    } else if (move.p && move.p === game.p2) {
      return { p1: [...score.p1], p2: [...score.p2, move.p]};
    } else {
      return score;
    }
  }, startingScores);
}