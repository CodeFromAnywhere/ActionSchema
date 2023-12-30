import { fs, path } from "fs-util";
import { projectRoot } from "get-path";
import { Context, Env } from "hono";
import { upsertDevice } from "person-util";
import { getFunctionItemWithName } from "function-wrappers";
import { O } from "js-util";
import { json } from "./helpers.js";

export const postModelAction = async (
  c: Context<Env, "/v1/*", {}>,
  functionName: string,
) => {
  const request = c.req;

  const url = new URL(request.url);
  const pathname = url.pathname;
  const hostname = url.hostname;

  // model stuff
  const [tld, mainDomain, subdomain] = hostname.split(".").reverse();

  const hasFiles = subdomain
    ? fs.existsSync(
        path.join(projectRoot, "memory/persons", subdomain, "files"),
      )
    : false;

  if (!subdomain || !hasFiles || !subdomain) {
    return json({
      isSuccessful: false,
      message:
        "Not found. Please go to [slug].actionschema.localhost/openapi.json or [slug].actionschema.com/openapi.json",
    });
  }

  const [_, version, model] = pathname.split("/");

  const projectRelativePath =
    subdomain && model
      ? path.join("memory/persons", subdomain, "files", model, `${model}.mdb`)
      : undefined;

  const absolutePath = projectRelativePath
    ? path.join(projectRoot, projectRelativePath)
    : undefined;

  if (!absolutePath || !fs.existsSync(absolutePath) || !functionName) {
    return json({
      isSuccessful: false,
      message: "Model not found",
    });
  }

  const headerObject = {
    "openai-ephemeral-user-id": request.headers.get("openai-ephemeral-user-id"),
    "User-Agent": request.headers.get("User-Agent"),
    authorization: request.headers.get("authorization"),
    Origin: request.headers.get("Origin"),
    Referer: request.headers.get("Referer"),
  };

  // 1) upsert device
  const device = await upsertDevice(headerObject);
  if (!device) {
    console.log("Couldn't create device", headerObject);
    return json({
      isSuccessful: false,
      message: "Couldn't create device",
      headers: request.headers,
    });
  }

  const providedContext = (await request.json()) as O;

  const inferredContext = {
    me_personSlug: device.currentPersonSlug,
    relation_personSlug: "root",
    host: `${mainDomain}.${tld}`,
    projectRelativePath,
  };

  const functionItem = await getFunctionItemWithName(functionName);

  if (typeof functionItem?.fn !== "function") {
    return json({
      isSuccessful: false,
      message: "No function found",
    });
  }

  const result = await functionItem.fn({
    ...providedContext,
    ...inferredContext,
  });

  return json(result);
};
