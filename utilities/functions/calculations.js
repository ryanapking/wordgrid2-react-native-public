import { letterValues } from '../config';

export function calculateWordValue(word) {
  return word.split("").reduce( (total, letter) => {
    return total + letterValues[letter.toLowerCase()];
  }, 0);
}

export function calculateLongestWordLength(words) {
  const longestWord = words.reduce( (currentLongestWord, word) => {
    if (word.length > currentLongestWord.length) {
      return word;
    } else {
      return currentLongestWord;
    }
  }, "");

  // console.log('longest word:', longestWord);
  // console.log(longestWord.length + " letter");

  return longestWord.length;
}

export function calculateHighestWordValue(words) {
  const mostValuableWord = words.reduce( (currentMostValuableWord, word) => {
    const wordValue = calculateWordValue(word);
    if (wordValue > currentMostValuableWord.value) {
      return {word, value: wordValue};
    } else {
      return currentMostValuableWord;
    }
  }, {word: "", value: 0});

  // console.log('most valuable word:', mostValuableWord.word);
  // console.log(mostValuableWord.value + " points");

  return mostValuableWord.value;
}

export function calculateMoveRating(word, longestWord, mostValuableWord) {
  // return a value from 0 to 10 which will be displayed in half stars
  if (word.length < 4) return 0;
  const wordValue = calculateWordValue(word);
  if (word.length >= longestWord || wordValue >= mostValuableWord) {
    return 10;
  } else {
    const valueScore = (wordValue / mostValuableWord) * 5;
    const lengthScore = (word.length / longestWord) * 5;

    const rating = Math.floor(valueScore + lengthScore);

    // console.log('rating', rating);

    return rating;
  }
}