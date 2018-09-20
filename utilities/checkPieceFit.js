import settings from './config';

function checkPieceFit(player) {
  // checks a player's pieces to see if any of them will fit on the board
  // loops until a piece that fits is found
  var spaceCheck = false;
  var checkRow = 0;
  while (spaceCheck === false && checkRow < settings.boardHeight) {
    var checkColumn = 0;
    while (spaceCheck === false && checkColumn < settings.boardWidth) {
      // we only care if this is an empty space
      if (settings.boardState[checkRow][checkColumn].letter === "") {
        // check each piece
        player.pieces.forEach( (piece) => {
          var referenceRow = piece[0].row;
          var referenceColumn = piece[0].column;
          var pieceCheck = true;
          piece.forEach( (letterTile) => {
            var rowDiff = parseInt(letterTile.row) - referenceRow;
            var columnDiff = parseInt(letterTile.column) - referenceColumn;
            var row = checkRow + rowDiff;
            var column = checkColumn + columnDiff;
            // console.log("row: ", row, "column: ", column);
            if (row < 0 || column < 0 || row >= settings.boardHeight || column >= settings.boardWidth || settings.boardState[row][column].letter !== "") {
              pieceCheck = false;
            }
          });
          if (pieceCheck) {
            spaceCheck = true;
            // console.log("check true");
            // console.log("piece: ", piece);
            // console.log("space: ", checkRow, checkColumn);
          }
        });

      }
      checkColumn++;
    }
    checkRow++;
  }
  return spaceCheck;
}