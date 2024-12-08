import {
  isWhitespace,
  isLetter,
  isDigit,
  processWordOrIdentifier,
  processNumber,
  processOperator,
  processDelimiter,
  processString,
} from './utils/helpers.js';

export type Token = {
  type:
    | 'KEYWORD'
    | 'IDENTIFIER'
    | 'STRING'
    | 'NUMBER'
    | 'DECIMAL'
    | 'OPERATOR'
    | 'DELIMITER'
    | 'ERROR'
    | 'EOF';
  lexeme: string;
  line: number; // Line number where the token appears
};

// Lexical analyzer function
export const lexicalAnalyzer = (code: string): Token[] => {
  const tokens: Token[] = [];
  let currentPosition = 0; // Current absolute position in the code
  let currentLine = 1; // Current line number in the source code

  while (currentPosition < code.length) {
    let character = code[currentPosition];

    // Increment line number if newline character is found
    if (character === '\n') {
      currentLine++;
      currentPosition++;
      continue;
    }

    // Skip whitespace characters
    if (isWhitespace(character)) {
      currentPosition++;
      continue;
    }

    // Process keywords or identifiers
    if (isLetter(character)) {
      currentPosition = processWordOrIdentifier(
        code,
        currentPosition,
        tokens,
        currentLine,
      );
      continue;
    }

    // Process numbers (integers or decimals)
    if (isDigit(character)) {
      currentPosition = processNumber(
        code,
        currentPosition,
        tokens,
        currentLine,
      );
      continue;
    }

    // Process strings
    if (character === '"') {
      currentPosition = processString(
        code,
        currentPosition,
        tokens,
        currentLine,
      );
      continue;
    }

    // Process operators
    currentPosition = processOperator(
      code,
      currentPosition,
      tokens,
      currentLine,
    );

    // Process delimiters
    currentPosition = processDelimiter(
      code,
      currentPosition,
      tokens,
      currentLine,
    );
  }

  // Add EOF token to indicate end of the file
  tokens.push({ lexeme: '', type: 'EOF', line: currentLine });

  return tokens;
};
