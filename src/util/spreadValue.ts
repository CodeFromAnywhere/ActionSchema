import { flatten } from "./dot-wild.js";
import { getDotLocation } from "./getDotLocation.js";

/** Get multiple key-value pairs for a JSON blob */
export const spreadValue = (key: string, value: any) => {
  if (typeof value !== "object") {
    return [{ key, value }];
  }

  // For bigger things we flatten it first!
  const flat = flatten(value);
  const flatKeys = Object.keys(flat);
  const keys = flatKeys.map((k) => (key === "" ? k : `${key}.${k}`));

  // console.log({ keys });
  const pairs = keys.map((k) => {
    const v = getDotLocation(value, k);
    const fullKey = key === "" ? k : `${key}.${k}`;
    return { key: fullKey, value: v };
  });

  return pairs;
};
