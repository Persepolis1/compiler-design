const { TRANSITION_TABLE } = require('./constants/transitionTable');
let currentCharacter = -1;
//SET TO TRUE IF UNIT TESTING
const unitTest = false;

function getAllTokens(input, line) {
  let state = 1;
  const tokens = [];
  let tokenStart;
  let tokenFound = true;
  const inputToBuffer = input.split("");
  inputToBuffer.push('');
  for (let i = 0; i < inputToBuffer.length; i++) {
    currentCharacter++;
    let currentChar = inputToBuffer[i];
    if (tokenFound) {
      tokenStart = i;
      tokenFound = false;
    }
    state = TRANSITION_TABLE[state][currentChar];
    //Invalid token
    if (state === undefined) {
      tokens.push({
        Token: 'Error',
        position: currentCharacter,
        value: inputToBuffer.slice(tokenStart, i + 1).join("").trim(),
        line
      });
      state = 1;
      tokenFound = true;
      continue;
    }
    if (TRANSITION_TABLE[state].isFinal) {
      tokenFound = true;
      if (TRANSITION_TABLE[state].backtrack) {
        i -= 1;
        currentCharacter--;
      }
      if (!(TRANSITION_TABLE[state].token === 'COMMENT' || TRANSITION_TABLE[state].token === 'MULTI_COMMENT')) {
        tokens.push({
          Token: TRANSITION_TABLE[state].token,
          position: currentCharacter,
          value: inputToBuffer.slice(tokenStart, i + 1).join("").trim(),
          line
        });
      }
      state = 1;
    }
  }
  if( unitTest ){
    currentCharacter = -1;
  }
  return tokens;
}

module.exports = getAllTokens;
