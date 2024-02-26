import { OpenAPIDocument } from "../types/openapi.schema.js";
import { fetchWithTimeout } from "./fetchWithTimeout.js";

const openapis: { [url: string]: OpenAPIDocument } = {};

/** Fetches openapi but with cache */
export const fetchOpenapi = async (openapiUrl: string | undefined) => {
  if (!openapiUrl) {
    return;
  }

  if (openapis[openapiUrl]) {
    // NB: cached in memory
    return openapis[openapiUrl];
  }

  const isYaml = openapiUrl.endsWith(".yaml");

  const { json, status, statusText, text } =
    await fetchWithTimeout<OpenAPIDocument>(
      openapiUrl,
      {
        headers: isYaml
          ? undefined
          : {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
      },
      30000,
    );

  if (json) {
    // NB: set cache
    openapis[openapiUrl] = json;
  }

  return json || undefined;
};
