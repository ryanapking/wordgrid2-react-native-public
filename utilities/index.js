export { generateBoard, generatePiece, generateLocalPiece, generateGame, getRandomLetter } from './functions/generators';
export { remoteToLocal, localToRemote, consumedSquaresToWordPath, boardStringToArray, pieceStringToArray } from './functions/dataConversions';
export { calculateWordValue } from './functions/calculations';
export { checkPieceFit, scoreTabulator, getWinner } from './functions/checks';
export { getScoreBoard, getAnimationData } from './functions/getters';