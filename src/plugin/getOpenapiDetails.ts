import { ActionSchemaPlugin } from "../types/action-schema-plugin.schema.js";
import { OpenAPIDetails } from "../types/action-schema.schema.js";
import { fetchOpenapi } from "./fetchOpenapi.js";

/**
 * Determines the openapi url based on the plugins and content of the plugin
 */
export const getOpenapiDetails = async (
  $openapi: OpenAPIDetails | undefined,
  actionSchemaPlugins: ActionSchemaPlugin[] | undefined,
) => {
  if (!$openapi) {
    console.log("getOpenApiDetails: NO $OPENAPI DETAILS On the plugin");
    return;
  }

  const url = new URL($openapi.url);

  if (!url) {
    console.log("getOpenApiDetails: NO URL");
    return;
  }

  const exactPlugin = actionSchemaPlugins?.find((x) => x.__id === $openapi.url);
  const plugin = exactPlugin
    ? exactPlugin
    : // NB: Temporary Exception
    $openapi.url === "https://root.actionschema.com/openapi.json"
    ? actionSchemaPlugins?.find((x) =>
        x.__id?.endsWith(".actionschema.com/openapi.json"),
      )
    : undefined;

  if (!plugin) {
    console.log("getOpenApiDetails: Plugin couldn't be found", {
      actionSchemaPlugins,
      urlToMatchId: $openapi.url,
      plugin,
    });
    return;
  }

  const headers = plugin.headers as any;

  if (!headers) {
    console.log("getOpenApiDetails: Headers couldn't be found", {
      actionSchemaPlugins,
      urlToMatchId: $openapi.url,
      headers,
    });
    return;
  }

  const isDev = process.env.IS_DEV === "true";

  const realOpenapiUrl =
    (isDev || plugin.isInternallyHosted) &&
    plugin.localhostOpenapiUrl &&
    plugin.localhostOpenapiUrl !== ""
      ? plugin.localhostOpenapiUrl
      : $openapi.url;

  const openapi = await fetchOpenapi(realOpenapiUrl);

  if (!openapi) {
    console.log("getOpenApiDetails: OpenAPI Not available", realOpenapiUrl);
  }

  // Server origin url including '/'
  const serverOriginUrl = openapi?.servers?.[0]?.url || url.origin;

  const apiUrl = `${serverOriginUrl}${$openapi.path}`;
  const method = $openapi.method;

  return { apiUrl, method, headers };
};
