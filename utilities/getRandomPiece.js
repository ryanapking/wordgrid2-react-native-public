import settings from './config';
import { getRandomLetter, setCharAt } from "./tools";

export default function getRandomPiece(pieceSize = 4) {
  // number of possible spaces
  let possibleSpaces = settings.maxPieceWidth * settings.maxPieceHeight;

  // choose a random starting point within the grid
  let randomSpaces = [Math.floor(Math.random() * possibleSpaces)];

  // get some random spaces that will be filled with letters
  while (randomSpaces.length < pieceSize) {

    // start from the last element in the array
    let lastSpace = randomSpaces[randomSpaces.length - 1];
    let lastRow = Math.floor(lastSpace / settings.maxPieceWidth);
    let lastColumn = lastSpace % settings.maxPieceWidth;
    let newRow, newColumn = null;

    // randomly move up, down, left, or right
    if (Math.random() >= .5) {
      if (Math.random() >= .5) {
        newRow = lastRow + 1;
      } else {
        newRow = lastRow - 1;
      }
      newColumn = lastColumn;
    } else {
      if (Math.random() >= .5) {
        newColumn = lastColumn + 1;
      } else {
        newColumn = lastColumn - 1;
      }
      newRow = lastRow;
    }

    // make sure our new letter space is within the bounds of our piece guidelines
    let rowValid = newRow >= 0 && newRow < settings.maxPieceWidth;
    let columnValid = newColumn >= 0 && newColumn < settings.maxPieceHeight;

    if ( rowValid && columnValid) {
      // convert back to a number for string manipulation
      let newSpace = (newRow * settings.maxPieceWidth) + newColumn;

      // see if the letter space is already filled
      if (!randomSpaces.includes(newSpace)) {
        randomSpaces.push(newSpace);
      }
    } else {
      // do something in case the piece generator is stuck in a corner
      randomSpaces.unshift(randomSpaces.pop());
    }
  }

  // build an piece with all the previous junk
  let piece = " ".repeat(possibleSpaces);

  randomSpaces.forEach( (space) => {
    piece = setCharAt(piece, space, getRandomLetter());
  });

  return piece;
}

