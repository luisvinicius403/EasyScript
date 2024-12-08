type TokenObject = {
  keyword: string;
  token: string;
};

export const keywords: TokenObject[] = [
  { keyword: 'variable', token: 'TK_VARIABLE' },
  { keyword: 'integer', token: 'TK_INTEGER' },
  { keyword: 'decimal', token: 'TK_DECIMAL' },
  { keyword: 'string', token: 'TK_STRING' },
  { keyword: 'if', token: 'TK_IF' },
  { keyword: 'else', token: 'TK_ELSE' },
  { keyword: 'do', token: 'TK_DO' },
  { keyword: 'while', token: 'TK_WHILE' },
  { keyword: 'read', token: 'TK_READ' },
  { keyword: 'write', token: 'TK_WRITE' },
];

export const operators: TokenObject[] = [
  { keyword: '=', token: 'TK_ASSIGN' },
  { keyword: '+', token: 'TK_SUM' },
  { keyword: '-', token: 'TK_SUBTRACT' },
  { keyword: '/', token: 'TK_DIVIDE' },
  { keyword: '*', token: 'TK_MULTIPLY' },
  { keyword: '==', token: 'TK_EQUAL' },
  { keyword: '!=', token: 'TK_NOT_EQUAL' },
  { keyword: '<', token: 'TK_LESS_THAN' },
  { keyword: '>', token: 'TK_GREATER_THAN' },
  { keyword: '<=', token: 'TK_LESS_EQUAL' },
  { keyword: '>=', token: 'TK_GREATER_EQUAL' },
];

export const delimiters: TokenObject[] = [
  { keyword: '(', token: 'TK_LEFT_PAREN' },
  { keyword: ')', token: 'TK_RIGHT_PAREN' },
  { keyword: '{', token: 'TK_LEFT_BRACE' },
  { keyword: '}', token: 'TK_RIGHT_BRACE' },
  { keyword: ';', token: 'TK_SEMICOLON' },
];
