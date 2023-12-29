import { getCapableJsonSchemaProperties, } from "capable-json-schema-js";
import { apiUrl } from "server-api-url";
import { camelCase } from "convert-case";
import { writeJsonToFile } from "fs-util";
import { projectRoot } from "get-path";
import { lockAction } from "lock-util";
import { jsonGpt } from "gpt-parse-json";
import { getAiApiCredentials } from "person-util";
import { getCapableJsonSchemaPluginFunctions } from "./getCapableJsonSchemaPluginFunctions.js";
import { notEmpty, onlyUnique2 } from "js-util";
import { getAbsoluteSchemaPath } from "actionschema-core";
import { getSchema } from "actionschema-core";
export const getSchemaSuggestion = async (description, properties, schema, standardContext) => {
    const { credentials } = await getAiApiCredentials(standardContext);
    if (!credentials) {
        return;
    }
    const swcFunctions = (await getCapableJsonSchemaPluginFunctions(standardContext))?.filter((x) => x.config?.plugin !== "source");
    const groups = (swcFunctions || [])
        .map((x) => x.config?.categories?.[0])
        .filter(notEmpty)
        .filter(onlyUnique2());
    // console.log({ properties, swcFunctions, groups });
    const pluginString = groups
        .map((group) => {
        return `${group}:\n\n${swcFunctions
            ?.filter((x) => x.config?.categories?.[0] === group)
            ?.map((x) => `${x.name}${x.config?.shortDescription
            ? ` - ${x.config.shortDescription}`
            : ""}`)
            .join("\n")}`;
    })
        .join("\n\n");
    const prompt = `I have a table with these columns:
  
  ${Object.keys(properties)
        .map((key) => {
        return `- ${key}${properties[key].description ? ` (${properties[key].description})` : ""}`;
    })
        .join("\n")}
  
I now want a new column with this description: ${description}

These are my available plugins:

${pluginString}

How should I name the new column, and which plugin seems most relevant?`;
    const jsonGptResult = await jsonGpt(prompt, '{"newColumnName":string, "pluginName":string}', credentials, "openai/chatgpt");
    const priceCredit = jsonGptResult.priceCredit;
    const newColumnName = jsonGptResult.jsonResponse?.newColumnName;
    const pluginName = jsonGptResult.jsonResponse?.pluginName;
    const key = newColumnName ? camelCase(newColumnName) : undefined;
    return { priceCredit, pluginName, key };
};
export const addSchemaColumn = async (context) => {
    const { description, projectRelativePath, ...standardContext } = context;
    const { schema, ...result } = await getSchema({
        ...standardContext,
        projectRelativePath,
    });
    const properties = getCapableJsonSchemaProperties(schema) || {};
    // console.log({ description, schema, result, });
    if (!result.isSuccessful || !schema || !projectRoot) {
        return result;
    }
    const suggestionResult = 
    // if one word, don't do this
    description.split(" ").length === 1
        ? undefined
        : await getSchemaSuggestion(description, properties, schema, standardContext);
    const { key, pluginName, priceCredit } = suggestionResult || {
        key: camelCase(description),
        pluginName: undefined,
        priceCredit: 0,
    };
    if (!key ||
        Object.keys(properties).includes(key) ||
        key === "__actionSchemaId") {
        console.log(`no key or already`);
        return {
            isSuccessful: false,
            message: key === "__actionSchemaId"
                ? "This key is forbidden"
                : !key
                    ? "No key"
                    : "Key was already present",
            priceCredit,
        };
    }
    const newProperties = {
        ...properties,
        [key]: {
            type: "string",
            description,
            creationPlugins: pluginName
                ? [
                    {
                        $openapi: {
                            operationId: pluginName,
                            method: "POST",
                            path: `/function/${pluginName}`,
                            url: `${apiUrl}/openapi.json`,
                        },
                        isVerticalExpandEnabled: false,
                        type: "creation",
                        context: {},
                        outputLocation: "result",
                    },
                ]
                : [],
        },
    };
    const mainSchema = schema;
    mainSchema.properties.items = {
        ...mainSchema.properties.items,
        items: {
            ...mainSchema.properties.items.items,
            type: "object",
            properties: newProperties,
        },
    };
    const schemaPath = getAbsoluteSchemaPath(projectRelativePath);
    const res = await lockAction(schemaPath, () => {
        return writeJsonToFile(schemaPath, mainSchema);
    });
    return {
        isSuccessful: true,
        message: `Column added`,
        key,
        priceCredit,
    };
};
addSchemaColumn.config = { isPublic: true };
//# sourceMappingURL=addSchemaColumn.js.map