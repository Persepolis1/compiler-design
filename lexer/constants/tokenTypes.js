// Arithmetic operators

const TokenType = {
  // Arithmetic Operators
  PLUS: '+', // +
  MINUS: '-', // -
  DIVIDE: '/', // /
  MULT: '*', // *
  // Comparision Operators
  LT: 'lt', // <
  LTE: 'leq', // <=
  NOT_EQUAL: 'neq', // <>
  GT: 'gt', // >
  GTE: 'geq', // >=
  DOUBLE_EQUAL: 'eq', // ==
  // Punctuation Operators
  COLON: ':', // :
  DOUBLE_COLON: 'sr', // ::
  SEMI_COLON: ';', // ;
  COMMA: ',', // ,
  PERIOD: '.', //.
  OPEN_PAR: '(', // (
  CLOSE_PAR: ')', // )
  OPEN_BRACE: '{', // {
  CLOSE_BRACE: '}', // }
  OPEN_BRACKET: '[', // [
  CLOSE_BRACKET: ']', // ]
  // Assignment Operators
  EQUAL: '=', // =
  // Comment Operators
  MULTI_COMMENT: 'MULTI_COMMENT', //  /* */
  COMMENT: 'COMMENT', // //
  // Reserved Keywords
  AND: 'and',
  NOT: 'not',
  OR: 'or',
  IF: 'if',
  THEN: 'then',
  ELSE: 'else',
  FOR: 'for',
  CLASS: 'class',
  INT: 'int',
  FLOAT: 'float',
  GET: 'get',
  PUT: 'put',
  RETURN: 'return',
  PROGRAM: 'program',
  // Literals
  INTEGER_LITERAL: 'intNum',
  FLOAT_LITERAL: 'floatNum',
  // Identifier
  ID: 'id',
};


module.exports = {
  TokenType
};
