import settings from '../config';

import { pieceStringToArray } from "./dataConversions";

export function generateGame(userID = null) {
  return {
    p1: userID, // user ID of player 2
    p2: null, // user ID of player 1
    t: userID, // user ID of next player to take a turn
    w: null, // string declaring a winner - "p1" or "p2"
    history: [
      {
        w: null, // word played
        p: null, // user ID of player to make the move
        b: generateBoard(), // board status at the end of the move
        p1: [ // player 1 pieces at the end of the move
          generatePiece(),
          generatePiece(),
          generatePiece(),
        ],
        p2: [ // player 2 pieces at the end of the move
          generatePiece(),
          generatePiece(),
          generatePiece(),
        ]
      }
    ]
  }
}

// a board is a 100 character string, filled to the defined density with random characters
export function generateBoard() {
  let randomSpaces = [];
  let boardSpaceCount = settings.boardWidth * settings.boardHeight;
  // get board spaces until we exceed the starting board density
  while ((randomSpaces.length / boardSpaceCount) < settings.startingLetterDensity) {
    let rando = Math.floor(Math.random() * boardSpaceCount);
    if (!randomSpaces.includes(rando)) {
      randomSpaces.push(rando);
    }
  }
  let board = " ".repeat(settings.boardWidth * settings.boardHeight);
  randomSpaces.forEach( (space) => {
    board = setCharAt(board, space, getRandomLetter());
  });
  return board;
}

export function generatePiece(pieceSize = 4) {
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

export function generateLocalPiece(pieceSize = 4) {
  const piece = generatePiece(pieceSize);
  return pieceStringToArray(piece);
}

export function getRandomLetter(letterString = settings.availableLetters) {
  let randoMax = letterString.length;
  let rando = Math.floor((Math.random() * randoMax));
  return letterString.charAt(rando);
}

export function setCharAt(str, index, chr) {
  if(index > str.length-1) return str;
  return str.substr(0,index) + chr + str.substr(index+1);
}