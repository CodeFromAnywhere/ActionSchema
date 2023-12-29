/** Allows for actionschema webhooks */
export const webhookPlugin = async (context) => {
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
};
//# sourceMappingURL=webhookPlugin.js.map