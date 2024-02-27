import { get } from "./dot-wild.js";

export const getDotLocation = (object: any, dotLocation: string) => {
  return get(object, dotLocation);
};
