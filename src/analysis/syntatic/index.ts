type Token = {
  type: string;
  lexeme: string;
  line: number;
};

type ASTNode = {
  type: string;
  value?: string;
  children?: ASTNode[];
};

export const syntaxAnalyzer = (tokens: Token[]): ASTNode => {
  let current = 0;

  // Helper function to get the current token
  const peek = () => tokens[current];

  // Helper function to consume the current token and check if it matches the expected type
  const consume = (expectedType: string): Token => {
    const token = peek();
    if (token.type !== expectedType) {
      throw new Error(
        `Syntax error at line ${token.line}: expected ${expectedType}, but found ${token.type}`,
      );
    }
    current++;
    return token;
  };

  // Main function to start the syntax analysis
  const parseProgram = (): ASTNode => {
    const declarations = parseDeclarations();
    const commands = [];

    // Parse commands until EOF is encountered
    while (peek().type !== 'EOF') {
      commands.push(parseCommand());
    }

    return {
      type: 'Program',
      children: [...declarations, ...commands],
    };
  };

  // Function to parse declarations (e.g., variable declarations)
  const parseDeclarations = (): ASTNode[] => {
    const declarations = [];
    while (peek().type === 'KEYWORD' && peek().lexeme === 'variable') {
      declarations.push(parseVariableDeclaration());
    }
    return declarations;
  };

  // Function to parse a variable declaration
  const parseVariableDeclaration = (): ASTNode => {
    consume('KEYWORD'); // "variable"
    const type = consume('KEYWORD'); // Variable type
    const identifier = consume('IDENTIFIER'); // Variable name
    consume('OPERATOR'); // "="
    const value = parseValue(); // Variable value
    consume('DELIMITER'); // ";"

    return {
      type: 'VariableDeclaration',
      children: [
        { type: 'Type', value: type.lexeme },
        { type: 'Identifier', value: identifier.lexeme },
        { type: 'Value', value: value.value },
      ],
    };
  };

  // Function to parse a value (number, string, etc.)
  const parseValue = (): ASTNode => {
    const token = peek();
    if (token.type === 'NUMBER' || token.type === 'DECIMAL') {
      current++;
      return { type: 'Number', value: token.lexeme };
    }
    if (token.type === 'STRING') {
      current++;
      return { type: 'String', value: token.lexeme };
    }
    throw new Error(
      `Syntax error at line ${token.line}: invalid value (${token.type})`,
    );
  };

  // Function to parse a command (if, while, etc.)
  const parseCommand = (): ASTNode => {
    const token = peek();
  
    if (token.type === 'KEYWORD') {
      if (token.lexeme === 'if') {
        return parseConditionalDeclaration();
      }
      if (token.lexeme === 'while') {
        return parseWhileLoop();
      }
      if (token.lexeme === 'do') {
        return parseDoWhileLoop();
      }
      if (token.lexeme === 'read') return parseRead();
      if (token.lexeme === 'write') return parseWrite();
    }
  
    if (token.type === 'IDENTIFIER') {
      return parseAssignment();
    }
  
    throw new Error(
      `Syntax error at line ${token.line}: unexpected command (${token.lexeme})`,
    );
  };
  
  // Function to parse an if statement
  const parseConditionalDeclaration = (): ASTNode => {
    consume('KEYWORD'); // "if"
    consume('DELIMITER'); // "("
    const condition = parseCondition();
    consume('DELIMITER'); // ")"
    consume('DELIMITER'); // "{"
  
    const ifCommands = [];
    // Consumir todos os comandos dentro do bloco "if"
    while (peek().type !== 'DELIMITER' || peek().lexeme !== '}') {
      ifCommands.push(parseCommand());
    }
  
    consume('DELIMITER'); // "}"
  
    let elseCommands = [];
    if (peek().lexeme === 'else') {
      consume('KEYWORD'); // "else"
      consume('DELIMITER'); // "{"
      // Consumir todos os comandos dentro do bloco "else"
      while (peek().type !== 'DELIMITER' || peek().lexeme !== '}') {
        elseCommands.push(parseCommand());
      }
      consume('DELIMITER'); // "}"
    }
  
    consume('DELIMITER'); // Expect the semicolon after the block
  
    return {
      type: 'IfElse',
      children: [
        { type: 'Condition', children: [condition] },
        { type: 'IfCommands', children: ifCommands },
        { type: 'ElseCommands', children: elseCommands },
      ],
    };
  };
  

  // Function to parse a condition (left operator right)
  const parseCondition = (): ASTNode => {
    const left = parseExpression();

    // Add logic for strings as direct conditions
    if (left.type === 'String') {
      return { type: 'Condition', children: [left] };
    }

    const operator = consume('OPERATOR');
    const right = parseExpression();

    return {
      type: 'Condition',
      children: [left, { type: 'Operator', value: operator.lexeme }, right],
    };
  };

  // Function to parse an expression (term + term)
  const parseExpression = (): ASTNode => {
    const left = parseTerm();
  
    // Loop para lidar com "+" e "-" (operadores de adição e subtração)
    while (
      peek().type === 'OPERATOR' &&
      (peek().lexeme === '+' || peek().lexeme === '-')
    ) {
      const operator = consume('OPERATOR');
      const right = parseTerm();
      return {
        type: 'Expression',
        children: [
          left,
          { type: 'Operator', value: operator.lexeme },
          right,
        ],
      };
    }
  
    return left; // Caso a expressão tenha apenas um termo
  };  

  // Function to parse a term (factor * factor)
  const parseTerm = (): ASTNode => {
    const factor = parseFactor();
    while (
      peek().type === 'OPERATOR' &&
      (peek().lexeme === '*' || peek().lexeme === '/')
    ) {
      const operator = consume('OPERATOR');
      const nextFactor = parseFactor();
      return {
        type: 'Term',
        children: [
          factor,
          { type: 'Operator', value: operator.lexeme },
          nextFactor,
        ],
      };
    }
    return factor;
  };

  // Function to parse a factor (identifier, number, decimal, string, or expression)
  const parseFactor = (): ASTNode => {
    const token = peek();
    if (token.type === 'IDENTIFIER') {
      current++;
      return { type: 'Identifier', value: token.lexeme };
    }
    if (token.type === 'NUMBER' || token.type === 'DECIMAL') {
      current++;
      return { type: 'Number', value: token.lexeme };
    }
    if (token.type === 'STRING') {
      current++;
      return { type: 'String', value: token.lexeme }; // Added support for strings
    }
    if (token.type === 'DELIMITER' && token.lexeme === '(') {
      consume('DELIMITER'); // "("
      const expression = parseExpression();
      consume('DELIMITER'); // ")"
      return expression;
    }
    throw new Error(
      `Syntax error at line ${token.line}: invalid factor (${token.lexeme})`,
    );
  };

  // Function to parse an assignment
  const parseAssignment = (): ASTNode => {
    const identifier = consume('IDENTIFIER');
    consume('OPERATOR'); // "="
    const expression = parseExpression();
    consume('DELIMITER'); // ";"

    return {
      type: 'Assignment',
      children: [{ type: 'Identifier', value: identifier.lexeme }, expression],
    };
  };

  // Function to parse a read statement
  const parseRead = (): ASTNode => {
    consume('KEYWORD'); // "read"
    consume('DELIMITER'); // "("
    const identifier = consume('IDENTIFIER');
    consume('DELIMITER'); // ")"
    consume('DELIMITER'); // ";"

    return {
      type: 'Read',
      children: [{ type: 'Identifier', value: identifier.lexeme }],
    };
  };

  // Function to parse a write statement
  const parseWrite = (): ASTNode => {
    consume('KEYWORD'); // "write"
    consume('DELIMITER'); // "("
    const value = parseExpression();
    consume('DELIMITER'); // ")"
    consume('DELIMITER'); // ";"

    return {
      type: 'Write',
      children: [value],
    };
  };

  // Function to parse a while loop
  const parseWhileLoop = (): ASTNode => {
    consume('KEYWORD'); // "while"
    consume('DELIMITER'); // "("
    const condition = parseCondition();
    consume('DELIMITER'); // ")"
    consume('DELIMITER'); // "{"
    const commands = [];
    while (peek().type !== 'DELIMITER' || peek().lexeme !== '}') {
      commands.push(parseCommand());
    }
    consume('DELIMITER'); // "}"

    return {
      type: 'WhileLoop',
      children: [
        { type: 'Condition', children: [condition] },
        { type: 'Commands', children: commands },
      ],
    };
  };

  // Function to parse a do-while loop
  const parseDoWhileLoop = (): ASTNode => {
    consume('KEYWORD'); // "do"
    consume('DELIMITER'); // "{"
  
    const commands = [];
    while (peek().type !== 'DELIMITER' || peek().lexeme !== '}') {
      commands.push(parseCommand());
    }
  
    consume('DELIMITER'); // "}" -> fechamento do bloco do-while
    consume('KEYWORD'); // "while"
    consume('DELIMITER'); // "("
    const condition = parseCondition(); // Condição do do-while
    consume('DELIMITER'); // ")"
    consume('DELIMITER'); // ";" -> ponto-e-vírgula que finaliza o while
  
    return {
      type: 'DoWhileLoop',
      children: [
        { type: 'Commands', children: commands },
        { type: 'Condition', children: [condition] },
      ],
    };
  };
    
  return parseProgram();
};
