const LineByLineReader = require('line-by-line');
const lr = new LineByLineReader('input.txt');
const { PARSE_TABLE, PUSH_MAP_TABLE } = require('./constants/parseTable');
const { RULES } = require('./constants/rules');
const { NON_TERMINALS } = require('./constants/nonTerminals');
const getAllTokens = require('./lexer/lexer');
const fs = require('fs');
const outputFile = 'output.txt';
const terminals = [0,"program",";","class","id","{","}","(",")",":",",","sr","for","if","then","else","return","get","put","+","-","floatNum","intNum","not","[","]","float","int","=","eq","geq","gt","leq","lt","neq","or","*","/","and","$"];
const stack = [];
let tokenStream = [];
const readTokens = [];
const outputArray = [];
let currentTokenIndex = 0;
let error = false;
const POP_ERROR = Object.keys(RULES).length + 1;
const SCAN_ERROR = POP_ERROR + 1;
lr.on('line', (line) =>{
  const allTokens = getAllTokens(line);
  for (let i = 0 ; i < allTokens.length; i++){
    tokenStream.push(allTokens[i].Token);
  }
});
lr.on('end', function () {
  tokenStream.push('$');
  parse();
  // All lines are read, file is closed now.
});
let token;
function parse(){
  stack.push('$');
  stack.push(1);
  console.log(`token stream: ${tokenStream}`);
  let token = nextToken();
  do {
    const stackTop = top();
    if (terminals.includes(stackTop)){
      if(stackTop === token){
        readTokens.push(stack.pop());
        token = nextToken();
      }
      else {
        outputArray.push(`Syntax Error at ${token} \n`);
        error = true;
        break;
      }
    }
    else{
      if(!(PARSE_TABLE[stackTop][terminals.indexOf(token)] === POP_ERROR || PARSE_TABLE[stackTop][terminals.indexOf(token)] == SCAN_ERROR) ){
        outputArray.push(`Sentencial Form:\n ${getSentencialForm()} \n`);
        stack.pop();
        inverseRHSMultiplePush(PARSE_TABLE[stackTop][terminals.indexOf(token)]);
      }
      else{
        readTokens.push((''));
        outputArray.push(`Syntax Error at position ${readTokens.length -1 }: ${readTokens.concat(token).join(' ')} \n`);
        error = true;
        break;
      }
    }
  } while (top() !== '$');
  if (token !== '$' || error){
    fs.writeFileSync(outputFile, outputArray.join(''));
    console.log('Parsing Failed!');
    return false;
  }
  else {
    outputArray.push(`Successfully parsed! \n ${getSentencialForm()} \n`);
    fs.writeFileSync(outputFile, outputArray.join(''));
    console.log('Parsing Success!');
    return true;
  }
}

function top(){
  return stack[stack.length-1];
}
function nextToken(){
  return tokenStream[currentTokenIndex++];
}
function lookAhead(){
  return (currentTokenIndex === tokenStream.length -1 ? tokenStream[ tokenStream.length -1] : tokenStream[currentTokenIndex + 1]);
}
function inverseRHSMultiplePush(ruleNumber) {
  outputArray.push(`USED RULE :\n ${RULES[ruleNumber]} \n\n`);
  const statesToInsertStack = PUSH_MAP_TABLE[ruleNumber];
  if (statesToInsertStack === undefined) {
    return;
  }
  // Remove negative states
  for (let i = 0; i < statesToInsertStack.length; i++){
    if (statesToInsertStack[i] < 0 ){
      statesToInsertStack[i] = terminals[statesToInsertStack[i] * -1]
    }
  }
  // Push in stack
  for (let i = 0 ; i < statesToInsertStack.length; i++){
    stack.push(statesToInsertStack[i]);
  }
}
function getSentencialForm(){
  const stackCopy = [...stack];
  for (let i = 0 ; i < stackCopy.length ; i++){
    const element = stackCopy[i];
    if (!terminals.includes(element)){
      stackCopy[i] = NON_TERMINALS[element];
    }
  }
  const sentencialForm = readTokens.concat(stackCopy.reverse());
  sentencialForm.pop();
  return sentencialForm.join(' ');
}
function skipError(stackTop, errorCode){
  const lookAheadToken = lookAhead();
  outputArray.push(`Syntax Error at ${lookAheadToken} \n`);
  if (errorCode === POP_ERROR){
    if (PARSE_TABLE[stackTop] === undefined){
      stack.pop();
      return;
    }
    if (lookAheadToken === '$' || !(PARSE_TABLE[stackTop][terminals.indexOf(lookAheadToken)] === POP_ERROR || PARSE_TABLE[stackTop][terminals.indexOf(lookAheadToken)] == SCAN_ERROR) )
    stack.pop();
  }
  else if (errorCode === SCAN_ERROR){
    if (PARSE_TABLE[stackTop] === undefined){
      token = nextToken();
      return;
    }
    while ((PARSE_TABLE[stackTop][terminals.indexOf(token)] === POP_ERROR || PARSE_TABLE[stackTop][terminals.indexOf(token)] == SCAN_ERROR) ){
      token = nextToken();
    }
  }

}
