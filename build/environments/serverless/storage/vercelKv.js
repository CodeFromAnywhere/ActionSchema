export const getDb = (databaseId) => {
    // this should connect with some sort of edge-db
    return {
        put: (dotLocation, value) => { },
    };
};
export const getStatusDb = (databaseId) => {
    return {
        put: async (dotLocation, status) => { },
        remove: async (dotLocation) => { },
    };
};
export const getPlugins = () => {
    const actionSchemaPlugins = [
        {
            __id: "https://api.codefromanywhere.com/openapi.json",
            headers: '{"Authorization":"Bearer xxx"}',
            localhostOpenapiUrl: "http://localhost:42000/openapi.json?hostname=api.codefromanywhere.com",
        },
    ];
    return actionSchemaPlugins;
};
//# sourceMappingURL=vercelKv.js.map