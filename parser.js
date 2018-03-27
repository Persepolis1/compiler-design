const jsonFile = require('jsonfile');
const LineByLineReader = require('line-by-line');
const { PARSE_TABLE, PUSH_MAP_TABLE, TERMINALS, TOKEN_LEAFS, TOKEN_NODES_OFFSET, TOKEN_NODES } = require('./constants/parseTable');
const { RULES } = require('./constants/rules');
const { NON_TERMINALS } = require('./constants/nonTerminals');
const {Node} = require('./node');
const getAllTokens = require('./lexer/lexer');
const semantics = require('./semantics');
const fs = require('fs');
const stack = [];
const semanticStack = [];
let tokenStream = [];
const tokensFull = [];
const readTokens = [];
const outputArray = [];
let currentTokenIndex = 0;
let error = false;
const POP_ERROR = Object.keys(RULES).length + 1;
const SCAN_ERROR = POP_ERROR + 1;
const unitTest = false;
// Modify table
for (let i = 1; i < PARSE_TABLE.length ; i++){
  const isNull = isNullable(i);
  if (isNull.yes) {
    for (let j = 0; j < PARSE_TABLE[i].length; j++) {
      if (PARSE_TABLE[i][j] === POP_ERROR) {
        PARSE_TABLE[i][j] = isNull.rule;
      }
    }
  }
}
function isNullable(nonTerminal){
  const nts = NON_TERMINALS[nonTerminal];
  const ruleArray = [];
  for (let i = 1; i < Object.keys(RULES).length; i++){
    const splitRule = RULES[i].split(' ');
    const index = splitRule.findIndex((arrow) => arrow === '->');
    if (splitRule[0] === nts){
      if (splitRule.includes('EPSILON')){
        return {yes: true, rule: i};
      }
      else if (NON_TERMINALS.includes(splitRule[index+1])){
        const nonterm = splitRule[index+1];
        const index2 = NON_TERMINALS.findIndex((nonTerm) => nonTerm === nonterm);
        ruleArray.push({index : index2, rule: i});
      }
    }
  }
  for (let k = 0;  k < ruleArray.length ; k++){
    const obj = ruleArray[k];
    const ntss = NON_TERMINALS[obj.index];
    for (let i = 1; i < Object.keys(RULES).length; i++){
      const splitRule = RULES[i].split(' ');
      if (splitRule[0] === ntss){
        if (splitRule.includes('EPSILON')){
          return {yes: true, rule: obj.rule};
        }
      }
    }
  }
  return false;
}
if (!unitTest) {
  const lr = new LineByLineReader('input.txt');
  lr.on('line', (line) => {
    const allTokens = getAllTokens(line);
    for (let i = 0; i < allTokens.length; i++) {
      tokenStream.push(allTokens[i].Token);
      tokensFull.push(allTokens[i]);
    }
  });
  lr.on('end', function () {
    tokenStream.push('$');
    tokensFull.push({Token: '$', value: '$'});
     const result = parse();
     semantics(result.ast);
    // All lines are read, file is closed now.
  });
}
function hasNumber(myString) {
  return /\d/.test(myString);
}
let token;
function parse(outputFile = 'derivations.txt', tokens = []){
  stack.push('$');
  stack.push(1);
  if (tokens.length > 0){
    tokenStream = tokens;
  }
  console.log(`token stream: ${tokenStream.join(' ')}`);
  let token = nextToken();
  do {
    let stackTop = top();
    //console.log(stack);
    if (stackTop.toString().includes('@')){
        const nodeName = stack.pop().substring(1);
        if (hasNumber(nodeName)){
          const action = nodeName.split(',');
          const temp = [];
          for (let i = 0; i < action[0]; i++){
            temp.unshift(semanticStack.pop());
          }
          // get parent node
          const parent = temp[action[1]-1];
          //remove parent node
          temp.splice(action[1] -1,1);
          //set rest as children
          parent.makeFamily(temp);
          semanticStack.push(parent)
        }
        else if (TOKEN_NODES_OFFSET.includes(nodeName)){
          const offset = nodeName.split('!');
          const node = new Node(offset[0],null);
          node.setLeaf(tokensFull[currentTokenIndex - offset.length]);
          semanticStack.push(node);
        }
        else if(nodeName === 'noScoped'){
          const scopeSpecNode = semanticStack[semanticStack.length - 3];
          const scopeSpecId = semanticStack[semanticStack.length - 2];
          scopeSpecNode.makeFamily(scopeSpecId);
          semanticStack.splice(semanticStack.length - 2, 1);

        }
        else {
          const node = new Node(nodeName, null);
          if (TOKEN_LEAFS.includes(nodeName)){
            node.setLeaf(tokensFull[currentTokenIndex  -1 ]);
          }
          else if (TOKEN_NODES.includes(nodeName)){
            node.setHasToken(tokensFull[currentTokenIndex  -1 ]);
          }
          semanticStack.push(node);
        }
        // console.log("SEMANTIC STACK: ")
        // console.log(semanticStack);
        // console.log("SEMANTIC STACK END");
        continue;
    }
    if (TERMINALS.includes(stackTop)){
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
      if(!(PARSE_TABLE[stackTop][TERMINALS.indexOf(token)] === POP_ERROR || PARSE_TABLE[stackTop][TERMINALS.indexOf(token)] == SCAN_ERROR)){
        outputArray.push(`Sentencial Form:\n ${getSentencialForm()} \n`);
        stack.pop();
        // DEBUG : console.log(`Current position : row ${stackTop}, col ${TERMINALS.indexOf(token)} gives ${PARSE_TABLE[stackTop][TERMINALS.indexOf(token)]}  `);
        inverseRHSMultiplePush(PARSE_TABLE[stackTop][TERMINALS.indexOf(token)]);
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
    outputArray.push(`Token Stream : \n ${tokenStream.join(' ')}`);
    fs.writeFileSync(outputFile, outputArray.join(''));
    console.error('Parsing Failed!');
    return false;
  }
  else {
    outputArray.push(`Successfully parsed! \n ${getSentencialForm()} \n`);
    outputArray.push(`Token Stream : \n ${tokenStream.join(' ')}`);
    fs.writeFileSync(outputFile, outputArray.join(''));
    jsonFile.writeFile('ast.txt', semanticStack, {spaces: 2}, function (err) {
    });
    return {success:true, ast:semanticStack};
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
      statesToInsertStack[i] = TERMINALS[statesToInsertStack[i] * -1]
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
    if (!TERMINALS.includes(element)){
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
module.exports = parse;
