import { generateGame, remoteToLocal } from '../utilities';

export const game1Source = generateGame();

export const game1Local = remoteToLocal(game1Source);

export const game2Source = generateGame();

export const game2Local = remoteToLocal(game2Source);