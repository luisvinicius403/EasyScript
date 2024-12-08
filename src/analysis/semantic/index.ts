type ASTNode = {
  type: string;
  value?: string;
  children?: ASTNode[];
};

type Scope = {
  scopeLevel: number; // Scope level
  variables: Record<string, string>; // Variables defined in the scope (name and type)
};

export const semanticAnalyzer = (ast: ASTNode): Scope[] => {
  const scopes: Scope[] = []; // Array of scopes
  let currentScopeLevel = 0; // Tracks the current scope level

  const createNewScope = (): void => {
    scopes.push({ scopeLevel: currentScopeLevel, variables: {} });
  };

  const addVariableToScope = (name: string, type: string): void => {
    const currentScope = scopes[scopes.length - 1];
    if (currentScope) {
      currentScope.variables[name] = type;
    } else {
      throw new Error('Semantic error: No active scope to add variable.');
    }
  };

  const checkVariableInScopes = (name: string): boolean => {
    // Checks if the variable is defined in any scope
    for (let i = scopes.length - 1; i >= 0; i--) {
      if (scopes[i].variables[name]) {
        return true;
      }
    }
    return false;
  };

  const walkAST = (node: ASTNode): void => {
    if (node.type === 'Program') {
      // Initializes the global scope
      createNewScope();
      node.children?.forEach(child => walkAST(child));
    }

    if (node.type === 'VariableDeclaration') {
      const identifier = node.children?.find(child => child.type === 'Identifier');
      const type = node.children?.find(child => child.type === 'Type');

      if (identifier && type && identifier.value && type.value) {
        addVariableToScope(identifier.value, type.value);
      } else {
        throw new Error('Semantic error: Invalid variable declaration.');
      }
    }

    if (node.type === 'Assignment') {
      const identifier = node.children?.find(child => child.type === 'Identifier');
      if (identifier && identifier.value) {
        if (!checkVariableInScopes(identifier.value)) {
          throw new Error(`Semantic error: Variable '${identifier.value}' is not declared.`);
        }
      }
    }

    if (node.type === 'Block') {
      // Enters a new scope for blocks (e.g., if, while, etc.)
      currentScopeLevel++;
      createNewScope();
      node.children?.forEach(child => walkAST(child));
      currentScopeLevel--; // Exits the scope at the end of the block
    }

    if (node.children) {
      node.children.forEach(child => walkAST(child));
    }
  };

  walkAST(ast); // Starts the semantic analysis
  return scopes;
};
