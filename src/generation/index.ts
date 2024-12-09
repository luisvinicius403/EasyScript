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

    case 'VariableDeclaration': {
      const identifier = node.children?.find(
        (child) => child.type === 'Identifier',
      )?.value;
      const valueNode = node.children?.find((child) => child.type === 'Value');
      const value = valueNode ? generateJavaScript(valueNode) : 'undefined';

      return `let ${identifier} = ${value};`;
    }

    case 'Assignment': {
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

    case 'WhileLoop': {
      // While loop
      const condition = node.children?.find((child) => child.type === 'Condition');
      const commands = node.children?.find((child) => child.type === 'Commands');

      const jsCondition = condition ? generateJavaScript(condition) : '';
      const jsCommands =
        commands?.children?.map((child) => generateJavaScript(child)).join('\n') ||
        '';

      return `while (${jsCondition}) {\n${jsCommands}\n}`;
    }

    case 'DoWhileLoop': {
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
      return node.value || '';

    case 'Identifier':
      return node.value || '';

    case 'String':
      return `${node.value}`;

    case 'Number':
      return node.value || '';

    case 'Value':
      return node.value || '';

    default:
      return '';
  }
};
