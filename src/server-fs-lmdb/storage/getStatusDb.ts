import { open } from "lmdb";

export const getStatusDb = (databaseId: string) => {
  return open({
    path: `data/${databaseId}/status`,
    // any options go here, we can turn on compression like this:
    compression: true,
  });
};
