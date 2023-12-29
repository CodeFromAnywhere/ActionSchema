import { O, isAllTrue } from "js-util";
import { replaceVariables } from "./replaceVariables.js";

/**
 * Important function needed to determine whether or not an execution should happen
 */
export const isExecuteRequired = (
  row: O | undefined,
  propertyKey: string,
  mode: "recalculate" | "only-empty",
  propertyDependencies?: string[],
  isVerticalExpandEnabled?: boolean,
  condition?: string,
) => {
  if (!row) {
    return false;
    //No row found
  }

  const shouldRun =
    condition !== undefined && condition?.trim() !== ""
      ? replaceVariables(condition, row).trim() === "true"
      : true;

  if (!shouldRun) {
    console.log("condition not met", condition);
    return false;
  }

  const currentValue = row[propertyKey];

  if (
    isVerticalExpandEnabled &&
    currentValue !== null &&
    currentValue !== undefined
  ) {
    // NB: in case vertical expand is enabled, should only be ran if it's empty as it causes many new rows
    return false;
  }

  if (
    currentValue !== null &&
    currentValue !== undefined &&
    mode === "only-empty"
  ) {
    //already something while mode "only-empty is set"
    return false;
  }

  const hasPropertyDependencies = propertyDependencies?.map((key) => {
    const hasValue =
      row[key] !== null &&
      row[key] !== undefined &&
      /** This is a shitty little hack for now. If a variable resolves to false, it will stop execution */
      row[key] !== false;
    // console.log(`isExecuteRequired`, propertyKey, `value of ${key}`, row[key], {
    //   hasValue,
    // });

    return hasValue;
  });
  const hasAllDependencies = !hasPropertyDependencies
    ? true
    : isAllTrue(hasPropertyDependencies);

  // console.log({ hasPropertyDependencies, hasAllDependencies });

  if (!hasAllDependencies) {
    //Not all property dependencies are present
    return false;
  }

  return true;
};
