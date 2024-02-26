import { get } from "./dot-wild";

export const getDotLocation = (object: any, dotLocation: string) => {
  return get(object, dotLocation);
};
