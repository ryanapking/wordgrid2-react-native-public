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