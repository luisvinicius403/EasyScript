type ASTNode = {
  type: string;
  value?: string;
  children?: ASTNode[];
};

export const generateJavaScript = (node: ASTNode): string => {
  if (!node) return '';

  switch (node.type) {
    case 'Program':
      // Process all child nodes and concatenate their outputs
      return (
        node.children?.map((child) => generateJavaScript(child)).join('\n') ||
        ''
      );

    case 'Declarations':
      // Process declaration nodes recursively
      return (
        node.children?.map((child) => generateJavaScript(child)).join('\n') ||
        ''
      );

    case 'VariableDeclaration': {
      // Variable declaration
      const identifier = node.children?.find(
        (child) => child.type === 'Identifier',
      )?.value;
      const valueNode = node.children?.find((child) => child.type === 'Value');
      const value = valueNode ? generateJavaScript(valueNode) : 'undefined';

      return `let ${identifier} = ${value};`;
    }

    case 'Assignment': {
      // Variable assignment
      const identifier = node.children?.find(
        (child) => child.type === 'Identifier',
      )?.value;
      const expression = node.children?.find(
        (child) => child.type === 'Expression',
      );
      const value = expression ? generateJavaScript(expression) : 'undefined';

      return `${identifier} = ${value};`;
    }

    case 'IfElse': {
      // If-else conditional
      const condition = node.children?.find(
        (child) => child.type === 'Condition',
      );
      const ifCommands = node.children?.find(
        (child) => child.type === 'IfCommands',
      );
      const elseCommands = node.children?.find(
        (child) => child.type === 'ElseCommands',
      );

      const jsCondition = condition ? generateJavaScript(condition) : '';
      const jsIfCommands =
        ifCommands?.children
          ?.map((child) => generateJavaScript(child))
          .join('\n') || '';
      const jsElseCommands =
        elseCommands?.children
          ?.map((child) => generateJavaScript(child))
          .join('\n') || '';

      return `if (${jsCondition}) {\n${jsIfCommands}\n}${jsElseCommands ? ` else {\n${jsElseCommands}\n}` : ''}`;
    }

    case 'DoWhileLoop': {
      // Do-while loop
      const commands = node.children?.find(
        (child) => child.type === 'Commands',
      );
      const condition = node.children?.find(
        (child) => child.type === 'Condition',
      );

      const jsCommands =
        commands?.children
          ?.map((child) => generateJavaScript(child))
          .join('\n') || '';
      const jsCondition = condition ? generateJavaScript(condition) : '';

      return `do {\n${jsCommands}\n} while (${jsCondition});`;
    }

    case 'Condition': {
      // Conditional expression
      const left = node.children?.[0]
        ? generateJavaScript(node.children[0])
        : '';
      const operator = node.children?.[1]?.value || '';
      const right = node.children?.[2]
        ? generateJavaScript(node.children[2])
        : '';

      return `${left} ${operator} ${right}`;
    }

    case 'Expression': {
      // Expressions
      const left = node.children?.[0]
        ? generateJavaScript(node.children[0])
        : '';
      const operator = node.children?.[1]?.value || '';
      const right = node.children?.[2]
        ? generateJavaScript(node.children[2])
        : '';

      return `${left} ${operator} ${right}`;
    }

    case 'Write': {
      // Write function (console.log)
      const expressionNode = node.children?.find(
        (child) => child.type === 'Expression',
      );
      const valueNode = node.children?.find((child) => child.type === 'Value');
      const stringNode = node.children?.find(
        (child) => child.type === 'String',
      );
      const value = expressionNode
        ? generateJavaScript(expressionNode)
        : valueNode
          ? generateJavaScript(valueNode)
          : stringNode
            ? generateJavaScript(stringNode)
            : '""';

      return `console.log(${value});`;
    }

    case 'Type':
      // Return the type directly
      return node.value || '';

    case 'Identifier':
      // Identifiers
      return node.value || '';

    case 'String':
      // Add quotes around strings
      return `${node.value}`;

    case 'Number':
      // Return numbers directly
      return node.value || '';

    case 'Value':
      // Generic value handler
      return node.value || '';

    default:
      return '';
  }
};
