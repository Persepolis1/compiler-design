// Convert grammar into JSON format (one time setup)

const LineByLineReader = require('line-by-line');
const jsonfile = require('jsonfile');
const lr = new LineByLineReader('grammar.txt');

const outputFile = 'rules.js';
const jsonObject = {};
let lineNumber = 0;
const TOTAL_LINES = 113;
lr.on('line', (line) =>{
  lineNumber++;
  jsonObject[lineNumber] = line;
  if (lineNumber === TOTAL_LINES){
    jsonfile.writeFile(outputFile, jsonObject, {spaces: 2, flag: 'a'}, function(err) {})
  }
});

