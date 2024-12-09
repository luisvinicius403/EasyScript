import fs from 'fs';
import chalk from 'chalk';

import { lexicalAnalyzer } from './analysis/lexical/index.js';
import { syntaxAnalyzer } from './analysis/syntatic/index.js';
import { semanticAnalyzer } from './analysis/semantic/index.js';
import { generateJavaScript } from './generation/index.js';

// Read the code from code.txt
fs.readFile('./src/code.txt', 'utf8', (err, code) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Print the source code
  console.log(`${chalk.magenta('Source Code Read:')}\n${code}\n`);

  // Run the lexical analysis
  const tokens = lexicalAnalyzer(code);

  // Print the tokens with line numbers
  console.log(`${chalk.magenta('Tokens Generated:')}\n`, tokens);

  // Run the syntactic analysis
  const tree = syntaxAnalyzer(tokens);

  // Print the syntactic tree
  console.log(`${chalk.magenta('\n\nSyntactic Tree:')}`);
  printAST(tree);

  // Run the semantic analysis
  const variableScope = semanticAnalyzer(tree);

  // Print the variable scope table
  console.log(`${chalk.magenta('\n\nVariable Scope Table:')}\n`, variableScope);

  // Run the JavaScript generation
  const javaScript = generateJavaScript(tree)

  // Print the JavaScript code
  console.log(`${chalk.magenta('\n\nVariable Scope Table:')}\n`, javaScript);

  // Run JavaScript code
  const jsCode = javaScript;
});

// Function to print the AST
const printAST = (node: any, depth: number = 0): void => {
  const indent = '│   '.repeat(depth);
  const nodeLabel = node.value ? `${node.type}: ${node.value}` : `${node.type}`;
  console.log(`${indent}├── ${nodeLabel}`);

  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => printAST(child, depth + 1));
  }
};
