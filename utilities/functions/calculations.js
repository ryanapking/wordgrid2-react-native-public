export function calculateWordValue(word) {
  if (word.length <= 4) {
    // shouldn't be any words shorter than 4 letters, but might as well return a score in case something odd happens
    return 1;
  } else if (word.length === 5) {
    return 2;
  } else if (word.length === 6) {
    return 3;
  } else if (word.length === 7) {
    return 5;
  } else if (word.length >= 8) {
    // maybe just return word.length to make longer words more valuable?
    return 8;
  }
}

export function calculateLongestWordLength(words) {
  return words.reduce( (currentLongest, word) => {
    if (word.length > currentLongest) {
      return word.length;
    } else {
      return currentLongest;
    }
  }, 0);
}

export function calculateHighestWordValue(words) {
  return words.reduce( (currentHigh, word) => {
    const wordValue = calculateWordValue(word);
    if (wordValue > currentHigh) {
      return wordValue;
    } else {
      return currentHigh;
    }
  }, 0);
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

    console.log('rating');

    return rating;
  }
}