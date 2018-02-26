// Convert grammar into JSON row format (one time setup)

const LineByLineReader = require('line-by-line');
const jsonfile = require('jsonfile');
const lr = new LineByLineReader('grammar.txt');

const outputFile = 'nonTerminals.js';
let ruleArray = [];
let lineNumber = 0;
const TOTAL_LINES = 78;
lr.on('line', (line) =>{
  lineNumber++;
  ruleArray.push(line.split(' ')[0]);
  if (lineNumber === TOTAL_LINES){
    const set = new Set(ruleArray);
    const finalJson = [...set];
    jsonfile.writeFile(outputFile, finalJson, {spaces: 2, flag: 'a'}, function(err) {})
  }
});
