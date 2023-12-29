import { replaceVariables } from "capable-json-schema-js";
import { StandardFunctionConfig } from "function-types";
import { O } from "js-util";

export const calculateTemplate = (context: {
  description: string;
  /** is given automatically */
  row: O;
}) => {
  const { description, row } = context;
  const result = replaceVariables(description, row);
  return { isSuccessful: true, result };
};

calculateTemplate.config = {
  isPublic: true,
  plugin: "column",
  emoji: "📄",
  categories: ["util"],
  shortDescription: "Evaluate variables and return the result",
} satisfies StandardFunctionConfig;
