import { ActionSchemaPlugin } from "../../../types/action-schema-plugin.schema.js";

export const getPlugins = () => {
  const actionSchemaPlugins: ActionSchemaPlugin[] = [
    {
      __id: "https://api.codefromanywhere.com/openapi.json",
      headers: '{"Authorization":"Bearer xxx"}',
      localhostOpenapiUrl:
        "http://localhost:42000/openapi.json?hostname=api.codefromanywhere.com",
    },
  ];
  return actionSchemaPlugins;
};
