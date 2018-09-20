function scoreWord(word) {
  // calculate the score
  var wordScore = 0;
  for (var i = 0; i < word.length; i++) {
    var letter = word[i];
    var letterValue = eval(`this.letterValues.${letter}`);
    wordScore += letterValue;
  }
  // add it the player's current score
  this.currentPlayer.score += wordScore;
  // return the score to be attached to the word history
  return wordScore;
}