# Wordgrid 2 - React Native

### The Code

This is a word game written in React Native using Expo, Parse, Redux, React Router, and React Native Elements. It is a work in progress.

Note that some files are not managed in this repository. Due to this, downloading the repo and running expo start will NOT work.

### The Game

The Wordgrid 2 game was inspired by a combination of 1010! and Boggle. The game is currently missing a tutorial and needs some UI/UX work, so I'll describe the basic game modes and rules here:

##### Player vs Player

This is the standard game mode. You are competing against another player. (Except nobody is currently playing. Ha.) Each player takes five turns, and at the end of those five turns, barring a tie, the player with the highest score wins. Each turn consists of two phases:

1. Play a word at least 4 letters in length. These letters will be removed from the board. Your score for the turn is based on the sum of the score on the tiles played. The size of your opponent's next game piece will be based on the length of the word played.
2. Place one of your game pieces on the board.

That's it. Just go back and forth. The game is in the strategy.

##### Daily Challenge

The basic rules are the same as above, but without an opponent. You get five moves to get as high of a score as possible. The only notable difference is that placing a piece on the board also gets you points (1 point for each letter tile). The daily challenge is intended to be played multiple times, and your highest score is pushed to a database, where eventually every day a winner will be declared.

#### Try It Out

The application in its current state is hosted on Expo: [expo.io/@ryanapking/wordgrid2](https://expo.io/@ryanapking/wordgrid2). If you have an android phone, you can follow the instructions at that link to run it. Due to Apple's App Store policies, it will not load at that link on iPhone.

#### Watch a Hard-to-Follow GIF

![Alt Text](wordgrid2-screencap.gif)