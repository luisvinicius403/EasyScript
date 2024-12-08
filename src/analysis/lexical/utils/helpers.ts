import { keywords, operators, delimiters } from './tokenTable.js';
import { Token } from '../index.js';

// Check if a character is whitespace
export const isWhitespace = (char: string): boolean => /\s/.test(char);

// Check if a character is a letter
export const isLetter = (char: string): boolean => /[a-zA-Z]/.test(char);

// Check if a character is a digit
export const isDigit = (char: string): boolean => /[0-9]/.test(char);

// Process keywords or identifiers
export const processWordOrIdentifier = (
  code: string,
  currentPosition: number,
  tokens: Token[],
  line: number,
): number => {
  let lexeme = '';
  let character = code[currentPosition];

  while (/[a-zA-Z0-9]/.test(character)) {
    lexeme += character;
    currentPosition++;
    character = code[currentPosition];
  }

  const keyword = keywords.find((k) => k.keyword === lexeme);
  const type = keyword ? 'KEYWORD' : 'IDENTIFIER';

  tokens.push({ lexeme, type, line });
  return currentPosition;
};

// Process numbers (integers and decimals)
export const processNumber = (
  code: string,
  currentPosition: number,
  tokens: Token[],
  line: number,
): number => {
  let lexeme = '';
  let character = code[currentPosition];
  let hasDecimalPoint = false;

  while (/[0-9]/.test(character) || (character === '.' && !hasDecimalPoint)) {
    if (character === '.') {
      hasDecimalPoint = true;
    }
    lexeme += character;
    currentPosition++;
    character = code[currentPosition];
  }

  const type = hasDecimalPoint ? 'DECIMAL' : 'NUMBER';
  tokens.push({ lexeme, type, line });
  return currentPosition;
};

// Process strings
export const processString = (
  code: string,
  currentPosition: number,
  tokens: Token[],
  line: number,
): number => {
  let lexeme = '';
  let character = code[currentPosition];

  if (character === '"') {
    lexeme += character;
    currentPosition++;

    while (currentPosition < code.length) {
      character = code[currentPosition];

      if (character === '"') {
        lexeme += character;
        tokens.push({ lexeme, type: 'STRING', line });
        return currentPosition + 1; // Move past closing quote
      }

      lexeme += character;
      currentPosition++;
    }
  }

  // Handle unclosed string error
  tokens.push({ lexeme, type: 'ERROR', line });
  return currentPosition;
};

// Process operators (handles multi-character operators first)
export const processOperator = (
  code: string,
  currentPosition: number,
  tokens: Token[],
  line: number,
): number => {
  const twoCharOperator = code.slice(currentPosition, currentPosition + 2);
  const operator = operators.find((op) => op.keyword === twoCharOperator);

  if (operator) {
    tokens.push({ lexeme: twoCharOperator, type: 'OPERATOR', line });
    return currentPosition + 2;
  }

  const oneCharOperator = code[currentPosition];
  const singleOperator = operators.find((op) => op.keyword === oneCharOperator);

  if (singleOperator) {
    tokens.push({ lexeme: oneCharOperator, type: 'OPERATOR', line });
    return currentPosition + 1;
  }

  return currentPosition;
};

// Process delimiters
export const processDelimiter = (
  code: string,
  currentPosition: number,
  tokens: Token[],
  line: number,
): number => {
  const lexeme = code[currentPosition];
  const delimiter = delimiters.find((delim) => delim.keyword === lexeme);

  if (delimiter) {
    tokens.push({ lexeme, type: 'DELIMITER', line });
    return currentPosition + 1;
  }

  return currentPosition;
};
