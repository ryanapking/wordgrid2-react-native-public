import Trie from './trie';
import dictionary from './english-words';

const english = new Trie; // store all words in a trie
dictionary.words.forEach( (word) => {
  english.add(word.trim());
});

export default english;