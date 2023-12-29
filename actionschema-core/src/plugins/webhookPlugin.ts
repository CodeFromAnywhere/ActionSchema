import { StandardContext, StandardFunctionConfig } from "function-types";
import { O } from "js-util";

/** Allows for actionschema webhooks */
export const webhookPlugin = async (
  context: StandardContext & {
    /** URL that will receive a POST request with the row up until now */
    url: string;
    /** If needed, provide an authorization header here, e.g. "Bearer fskjdksljfkdsjfkldsjfjs" */
    authorizationHeader?: string;
    /** Automatically provided */
    row?: O;
  },
) => {
  const headers = context.authorizationHeader
    ? { Authorization: context.authorizationHeader }
    : undefined;

  fetch(context.url, {
    headers,
    body: JSON.stringify(context.row),
  })
    .then((result) => {
      //
    })
    .catch((e) => {
      //
    });

  //TODO: respond with the result of the webhook post
};

webhookPlugin.config = {
  isPublic: true,
  productionStatus: "beta",
  plugin: "column",
  emoji: "🪝",
  shortDescription: "Create a webhook where the row is sent",
  isInternetRequired: true,
  categories: ["internet"],
} satisfies StandardFunctionConfig;
