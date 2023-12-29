import { O, mergeObjectsArray } from "js-util";
/** utility function */
export const moveObjectKeyToIndex = <T extends O>(
  object: T,
  key: string,
  toIndex: number,
) => {
  const keys = Object.keys(object);
  const currentKeyIndex = keys.findIndex((x) => x === key);

  if (currentKeyIndex === -1) {
    return;
  }

  const beforeKeys = keys.slice(0, currentKeyIndex);
  const afterKeys = keys.slice(currentKeyIndex + 1);

  const newKeys = beforeKeys.concat(afterKeys);

  //  console.log({ newKeys });
  const newBeforeKeys = newKeys.slice(0, toIndex);
  const newAfterKeys = newKeys.slice(toIndex);
  const finalKeys = newBeforeKeys.concat([key, ...newAfterKeys]);

  //  console.log({ finalKeys });

  const newObject = mergeObjectsArray(
    finalKeys.map((k) => {
      return { [k]: object[k] };
    }),
  );

  //console.log({ newObject });

  return newObject;
};
