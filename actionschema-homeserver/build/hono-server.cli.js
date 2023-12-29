import { path } from "fs-util";
import { executeFunctionWithPaywall, getFunctionItemWithName, } from "function-wrappers";
import { getProjectRoot } from "get-path";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { log } from "log";
import { upsertDevice } from "person-util";
import { ports } from "port-conventions";
import { functionApiKeys } from "sdk-api-keys";
import { operations } from "sdk-operations";
import { URL } from "url";
import { getOpenapi } from "./getOpenapi.js";
import { postModelAction } from "./postModelAction.js";
import { json } from "./helpers.js";
import { isGetEndpoint } from "./isGetEndpoint.js";
import { isRawEndpoint } from "./isRawEndpoint.js";
import { tryGetParameters } from "./tryGetParameters.js";
const projectRoot = getProjectRoot();
if (!projectRoot) {
    console.log("No projectroot");
    process.exit();
}
const bunServerPath = path.join(projectRoot, operations["actionschema-homeserver"]);
if (process.cwd() !== bunServerPath) {
    console.log("Proces must be launced from actionschema-homeserver path (absolute paths aren't supported in hono/node)", bunServerPath);
    process.exit();
}
const app = new Hono({});
app.use("*", cors());
app.get("/", (c) => {
    const request = c.req;
    const openapiUrl = `${request.url}openapi.json`;
    return c.html(`<html><body><iframe width="100%" height="100%" src="https://preview.readme.io/reference?url=${encodeURIComponent(openapiUrl)}" /></body></html>`, 200);
});
app.get("/openapi.json", getOpenapi);
app.get("/v1/*", (c) => postModelAction(c, "actionSchemaRead"));
app.delete("/v1/*", (c) => postModelAction(c, "actionSchemaDelete"));
app.patch("/v1/*", (c) => postModelAction(c, "actionSchemaUpdate"));
app.post("/v1/*", (c) => postModelAction(c, "actionSchemaCreate"));
app.put("/v1/*", (c) => postModelAction(c, "actionSchemaExecute"));
app.post("*", async (c) => {
    const request = c.req;
    const url = new URL(request.url);
    const pathname = url.pathname;
    const origin = url.origin;
    const hostname = url.hostname;
    const method = request.method;
    if (!projectRoot) {
        return new Response("No root", { status: 404 });
    }
    if (pathname.startsWith("/function/")) {
        const functionName = pathname.slice("/function/".length);
        if (!functionName ||
            !functionApiKeys.includes(functionName) ||
            isGetEndpoint(functionName)) {
            console.log("POST ENDPOINT NOT FOUND", functionName);
            return json({
                isSuccessful: false,
                message: `Endpoint not found: GET /function/${functionName}`,
            });
        }
        const functionItem = await getFunctionItemWithName(functionName);
        if (!functionItem || !functionItem.fn) {
            console.log("FUNCTION NOT FOUND", {
                functionName,
                name: functionItem?.name,
            });
            const message = `Could not find function ${functionItem?.name}`;
            log(message, { type: "warning" });
            return json({
                isSuccessful: false,
                message,
            });
        }
        // console.timeEnd(`require-fn`);
        if (isRawEndpoint(functionName)) {
            console.log("ENDPOINT RAW");
            const result = await functionItem.fn(request);
            // NB: raw response (no json)
            return result;
        }
        const headerObject = {
            "openai-ephemeral-user-id": request.headers.get("openai-ephemeral-user-id"),
            "User-Agent": request.headers.get("User-Agent"),
            authorization: request.headers.get("authorization"),
            Origin: request.headers.get("Origin"),
            Referer: request.headers.get("Referer"),
        };
        // console.timeEnd(`h`);
        // performance.push(getNewPerformance("start", executionId, true));
        // 1) upsert device
        const device = await upsertDevice(headerObject);
        if (!device) {
            console.log("Couldn't create device");
            return {
                isSuccessful: false,
                message: "Couldn't create device",
            };
        }
        const me_person = device?.currentPersonCalculated;
        const parameters = (await tryGetParameters(request)) || [];
        const result = await executeFunctionWithPaywall({
            functionContext: {
                device,
                authToken: device.authToken,
                request,
                me_personSlug: me_person?.slug,
                relation_personSlug: "root",
            },
            functionName,
            me_person,
            parameters,
            isExternalCall: false,
            me_personSlug: me_person?.slug,
            relation_personSlug: "root",
        });
        return json(result);
    }
    if (pathname === "/") {
        return new Response("Hononode!", { status: 200 });
    }
    return new Response("Not found", { status: 404 });
});
const server = {
    fetch: app.fetch,
    port: ports["function-server"],
    hostname: "localhost",
};
export default server;
//# sourceMappingURL=hono-server.cli.js.map