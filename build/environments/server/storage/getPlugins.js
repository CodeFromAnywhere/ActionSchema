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
//# sourceMappingURL=getPlugins.js.map