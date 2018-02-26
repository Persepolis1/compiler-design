const { PARSE_TABLE, PUSH_MAP_TABLE } = require('./constants/parseTable');
const { RULES } = require('./constants/rules');
const { TABLE_ROWS } = require('./constants/tableRows');
const fs = require('fs');
const outputFile = 'output.txt';
const terminals = [0,"program",";","class","id","{","}","(",")",":",",","sr","for","if","then","else","return","get","put","+","-","floatNum","intNum","not","[","]","float","int","=","eq","geq","gt","leq","lt","neq","or","*","/","and","$"];
const stack = [];
const tokenStream = ['program', '{', 'if', '(', 'id' ,')', 'then' ,'{', 'get', '(', 'id', ')', ';', 'return', '(', 'id', ')', ';', '}', 'else', '{', 'if', '(', 'id', ')', 'then', 'else', '{', 'get', '(', 'id', ')', ';', 'return', '(', 'id', ')', ';','}', ';' ,'}', ';', '}' ,';','$'];
const readTokens = [];
const outputArray = [];
let currentTokenIndex = 0;
let error = false;
console.log(`token stream: ${tokenStream}`);
function parse(){
  stack.push('$');
  stack.push(1);
  let token = nextToken();
  do {
    const stackTop = top();
    if (terminals.includes(stackTop)){
      if(stackTop === token){
        readTokens.push(stack.pop());
        // console.log(readTokens);
        token = nextToken();
      }
      else {
        error = true;
        break;
      }
    }
    else{
      if(PARSE_TABLE[stackTop][terminals.indexOf(token)] !== undefined){
        outputArray.push(`Sentencial Form:\n ${getSentencialForm()} \n`);
        // console.log(`Sentencial Form: ${getSentencialForm()}`);
        stack.pop();
        inverseRHSMultiplePush(PARSE_TABLE[stackTop][terminals.indexOf(token)]);
      }
      else{
        error = true;
        break;
      }
    }
  } while (top() !== '$');
  if (token !== '$' || error){
    return false;
  }
  else {
    outputArray.push(`Sentencial Form:\n ${getSentencialForm()} \n`);
    return true;
  }
}

function top(){
  return stack[stack.length-1];
}

function nextToken(){
  return tokenStream[currentTokenIndex++];
}

function inverseRHSMultiplePush(state) {
  // console.log(`USED RULE : ${RULES[state]}`);
  outputArray.push(`USED RULE :\n ${RULES[state]} \n\n`);
  const statesToPush = PUSH_MAP_TABLE[state];
  if (statesToPush === undefined) {
    return;
  }
  // Remove negative states
  for (let i = 0; i < statesToPush.length; i++){
    if (statesToPush[i] < 0 ){
      statesToPush[i] = terminals[statesToPush[i] * -1]
    }
  }
  // Push in stack
  for (let i = 0 ; i < statesToPush.length; i++){
    stack.push(statesToPush[i]);
  }
}
function getSentencialForm(){
  const stackCopy = [...stack];
  for (let i = 0 ; i < stackCopy.length ; i++){
    const element = stackCopy[i];
    if (!terminals.includes(element)){
      stackCopy[i] = TABLE_ROWS[element].split(' ')[0];
    }
  }
  const sentencialForm = readTokens.concat(stackCopy.reverse());
  sentencialForm.pop();
  return sentencialForm.join(' ');
}

if(parse()){
  console.log('success!');
}
else
  console.log('fail');
fs.writeFile(outputFile, outputArray.join(''), function(err) {});
