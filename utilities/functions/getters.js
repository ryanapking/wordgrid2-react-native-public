export function getScoreBoard(game) {

  const emptyScoreObject = { p1: null, p2: null };

  const scores = game.history.reduce( (scores, move) => {

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

  return scores;

}