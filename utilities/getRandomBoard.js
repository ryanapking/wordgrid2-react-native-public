import settings from './config';
import { getRandomLetter, setCharAt } from "./tools";

// a board is a 100 character string, filled to the defined density with random characters
export default function getRandomBoard() {
  var randomSpaces = [];
  var boardSpaceCount = settings.boardWidth * settings.boardHeight;
  // get board spaces until we excede the starting board density
  while ((randomSpaces.length / boardSpaceCount) < settings.startingLetterDensity) {
    var rando = Math.floor(Math.random() * boardSpaceCount);
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
