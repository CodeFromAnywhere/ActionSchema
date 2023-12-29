import { fs, path } from "fs-util";
import { get, update } from "fsorm-lmdb";
import { projectRoot } from "get-path";
/**

Create migration that sets `Person.actionSchemaHeaders: { hostname: string; header: string; value: string }[]` to `api.actionschema.com` with the person authToken, just like all plugins in all actionschemas are supposed to be. Also for localhost, where its `http://localhost:42000`

 */
const migrate = async () => {
  const devices = (await get("Device")).result;

  update("Person", (item) => {
    const authToken = devices?.find((x) => x.currentPersonSlug === item.slug)
      ?.authToken;

    const actionSchemaHeaders = authToken
      ? [
          {
            origin: "http://localhost:42000",
            header: "Authorization",
            value: `Bearer ${authToken}`,
          },
          {
            origin: "https://api.actionschema.com",
            header: "Authorization",
            value: `Bearer ${authToken}`,
          },
          {
            origin: `https://${item.slug}.actionschema.com`,
            header: "Authorization",
            value: `Bearer ${authToken}`,
          },
        ]
      : undefined;

    return {
      ...item,
      actionSchemaHeaders,
    };
  });
};

migrate();
