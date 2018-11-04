export { generateBoard, generatePiece, generateLocalPiece, generateGame, getRandomLetter } from './functions/generators';
export { remoteToLocal, localToRemote, consumedSquaresToWordPath, boardStringToArray, pieceStringToArray } from './functions/dataConversions';
export { calculateWordValue, calculateHighestWordValue, calculateLongestWordLength, calculateMoveRating } from './functions/calculations';
export { checkPieceFit, scoreTabulator, getWinner } from './functions/checks';
export { getScoreBoard, getAnimationData } from './functions/getters';