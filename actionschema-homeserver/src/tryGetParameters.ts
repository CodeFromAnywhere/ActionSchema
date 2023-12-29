import { HonoRequest } from "hono";

export const tryGetParameters = async (
  request: Request | HonoRequest,
): Promise<any[] | undefined> => {
  try {
    // NB; capitalisation doesn't matter
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("json")) {
      // NB: getting json will only be done if content-type application/json or xxx/json is set.
      // This ensures we can still get FormData if needed (we can only get something once unless we clone it)
      return;
    }

    const parameters = (await request.json()) as any;

    // NB: parameters must be an array of parameters
    if (Array.isArray(parameters)) {
      return parameters;
    }
    return [parameters];
  } catch (e) {
    return undefined;
  }
};
