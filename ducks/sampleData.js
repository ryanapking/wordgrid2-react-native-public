export const game1Source = {
  p1: 'erica',
  p2: 'joseph',
  history: [
    {
      b: "game one  abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg ",
      p1: [
        "p   l   u   g   ",
        " o   q   z   c  ",
        "po  p   t   k   "
      ],
      p2: [
        "p   l   u   g   ",
        " o   q   z   c  ",
        "po  p   t   k   "
      ]
    },
  ],
};

export const game1Local = sourceToLocal(game1Source);

export const game2Source = {
  p1: 'erica',
  p2: 'joseph',
  history: [
    {
      b: "game two  abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg abc  defg ",
      p1: [
        "p   l   u   g   ",
        " o   q   z   c  ",
        "po  p   t   k   "
      ],
      p2: [
        "p   l   u   g   ",
        " o   q   z   c  ",
        "po  p   t   k   "
      ]
    },
  ],
};

export const game2Local = sourceToLocal(game2Source);

function sourceToLocal(source) {
  const current = source.history[source.history.length - 1];
  const rows = boardStringToArray(current.b);
  const p1 = current.p1.map( (piece) => pieceStringToArray(piece));
  const p2 = current.p2.map( (piece) => pieceStringToArray(piece));
  return {
    consumedSquares: [],
    rows,
    me: p1,
    them: p2
  }
}

function pieceStringToArray(pieceSource) {
  return Array(4).fill(1).map( (val, index ) => {
    const start = index * 4;
    const end = start + 4;
    return pieceSource.slice(start, end).split("");
  });
}

function boardStringToArray(boardSource) {
  return Array(10).fill(1).map( (val, index) => {
    const start = index * 10;
    const end = start + 10;
    return boardSource.slice(start, end).split("");
  });
}