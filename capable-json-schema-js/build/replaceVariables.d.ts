/**
For strings in the `context`, assume it's a string literal, so allow for `${}` syntax for using values of other columns.

Example:

```

console.log(
  replaceVariables(
    "Hey ${name}, how are you doing ${name} and how is your ${age}th year?",
    { name: "wijnand", age: "30" },
  ),
);
```
 */
export declare const replaceVariables: (stringLiteral: string, row: {
    [key: string]: any;
}) => string;
//# sourceMappingURL=replaceVariables.d.ts.map