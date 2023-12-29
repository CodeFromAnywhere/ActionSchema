/** helper function to return JSON response */
export const json = (json) => new Response(JSON.stringify(json), {
    // NB: text/json would return it witout emojis
    headers: {
        "Content-Type": "application/json;charset=utf-8",
        ...defaultHeaders,
    },
});
export const defaultHeaders = {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Cross-Origin-Resource-Policy": "cross-origin",
};
//# sourceMappingURL=helpers.js.map