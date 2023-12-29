import { findVariables } from "./findVariables.js";
import { tryJsonStringify } from "try-parse-json";
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
export const replaceVariables = (stringLiteral, row) => {
    findVariables(stringLiteral).map((variable) => {
        const value = row[variable];
        const string = typeof value === "string" ||
            typeof value === "boolean" ||
            typeof value === "number"
            ? String(value)
            : tryJsonStringify(value) || String(value);
        stringLiteral = stringLiteral.replace("${" + variable + "}", string);
    });
    return stringLiteral;
};
//# sourceMappingURL=replaceVariables.js.map