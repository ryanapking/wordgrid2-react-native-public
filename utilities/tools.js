import settings from './config';

export function setCharAt(str, index, chr) {
  if(index > str.length-1) return str;
  return str.substr(0,index) + chr + str.substr(index+1);
}

export function getRandomLetter(letterString = settings.availableLetters) {
  let randoMax = letterString.length;
  let rando = Math.floor((Math.random() * randoMax));
  return letterString.charAt(rando);
}