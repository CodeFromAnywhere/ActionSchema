export const findVariables = (stringLiteral: string) => {
  //1) detect ${name} syntax with a regex

  const matches = stringLiteral.match(/\$\{(.*?)\}/g);
  if (!matches) {
    return [];
  }

  //2) replace each variable with its stringvalue in the row
  const variables = Array.from(matches.entries()).map(([_, match]) => {
    const variable = match.slice(2).slice(0, match.length - 3);
    return variable;
  });

  return variables;
};
