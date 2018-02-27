const LineByLineReader = require('line-by-line');
const parse = require('../../parser');
const getAllTokens = require('../../lexer/lexer');
describe('Parser Tests', () => {
  describe('Smaller Programs', () => {
    it('Parses sp1_input.txt', () => {
      const postFix = 'sp1';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_output.txt`, [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
    it('Parses sp2_input.txt', () => {
      const postFix = 'sp2';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_output.txt`, [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
    it('Parses sp3_input.txt', () => {
      const postFix = 'sp3';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_ouput.txt`, [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
    it('Parses sp4_input.txt', () => {
      const postFix = 'sp4';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_ouput.txt`, [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
    it('Parses sp5_input.txt', () => {
      const postFix = 'sp5';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_ouput.txt`, [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
  })
  describe('Medium Programs', () => {
    it('Parses mp1_input.txt', () => {
      const postFix = 'mp1';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_output.txt`, [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
    it('Parses mp2_input.txt', () => {
      const postFix = 'mp2';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_output.txt`, [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
  })

  describe('Larger Programs', () => {
    it('Parses lp1_input.txt', () => {
      const lr = new LineByLineReader('./tests/Parser/lp1_input.txt');
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse('./tests/Parser/lp1_output.txt', [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
    it('Parses lp2_input.txt', () => {
      const lr2 = new LineByLineReader('./tests/Parser/lp2_input.txt');
      const tokenStream = [];
      lr2.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr2.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse('./tests/Parser/lp2_output.txt', [...tokenStream])).toBe(true);
        // All lines are read, file is closed now.
      });
    });
  })
  describe('Invalid Programs', () => {
    it('Parses ip1_input.txt', () => {
      const postFix = 'ip1';
      const lr = new LineByLineReader(`./tests/Parser/${postFix}_input.txt`);
      const tokenStream = [];
      lr.on('line', (line) =>{
        const allTokens = getAllTokens(line);
        for (let i = 0 ; i < allTokens.length; i++){
          tokenStream.push(allTokens[i].Token);
        }
      });
      lr.on('end', function () {
        console.log('end');
        tokenStream.push('$');
        expect(parse(`./tests/Parser/${postFix}_output.txt`, [...tokenStream])).toBe(false);
        // All lines are read, file is closed now.
      });
    });
  })
});
