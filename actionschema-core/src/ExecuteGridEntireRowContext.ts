import { StandardContext } from "function-types";

export type ExecuteGridEntireRowContext = {
  projectRelativePath: string;
  rowIds: string[];
  mode: "recalculate" | "only-empty";
};
