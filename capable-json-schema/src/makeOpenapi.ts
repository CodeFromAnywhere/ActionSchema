import { StandardContext, StandardFunctionConfig } from "function-types";
import { fs, path } from "fs-util";
import { projectRoot } from "get-path";
import { readJsonFile } from "read-json-file";
import {
  CapableJsonSchema,
  JSONSchema7Type,
  MainCapableJsonSchema,
} from "capable-json-schema-js";
import {
  O,
  mergeObjectsArray,
  notEmpty,
  removeOptionalKeysFromObjectStrings,
} from "js-util";
import {
  OpenapiDocument,
  OpenapiMediaType,
  OpenapiSchemaObject,
} from "schema-types";
import { withoutSubExtensions } from "fs-util-js";
import { kebabCase, pascalCase } from "convert-case";
import { getIndexedSwcStatement } from "swc-util";
import { SwcFunction } from "swc-types";

export const withoutProperties = (
  schema: OpenapiSchemaObject,
  properties: string[],
) => {
  if (!schema.properties) {
    return schema;
  }

  const newProperties = removeOptionalKeysFromObjectStrings(
    schema.properties,
    properties,
  );

  return { ...schema, properties: newProperties };
};

export const replaceRefs = (schema: OpenapiSchemaObject, refs: O) => {
  const string = JSON.stringify(schema);

  const finalString = Object.keys(refs).reduce((newString, refKey) => {
    const json = JSON.stringify(refs[refKey]);
    const jsonWithoutBrackets = json.slice(1, json.length - 1);

    // NB: no spaces!
    return newString.replaceAll(`"$ref":"${refKey}"`, jsonWithoutBrackets);
  }, string);

  // console.log(finalString);
  return JSON.parse(finalString) as any;
};

/** Renames all refs to #/components/schemas/ instead of #/definitions */
export const renameRefs = (schema: OpenapiSchemaObject | undefined) => {
  if (!schema) {
    return schema;
  }
  const string = JSON.stringify(schema);

  const newString = string.replaceAll(
    `"$ref":"#/definitions/`,
    `"$ref":"#/components/schemas/`,
  );

  return JSON.parse(newString) as any;
};

/**
Should make the openapi from all tables

https://docs.readme.com/main/docs/openapi-compatibility-chart
https://swagger.io/docs/specification/about/
 */

export const makeOpenapi = async (context: StandardContext) => {
  if (!context.me_personSlug || !context.host) {
    return { isSuccessful: false, message: "Please login" };
  }

  const projectRelativeLocation = [
    "memory/persons",
    context.me_personSlug,
    "files",
  ];

  const absoluteFilesPath = path.join(projectRoot, ...projectRelativeLocation);

  if (!fs.existsSync(absoluteFilesPath)) {
    return { isSuccessful: false, message: "Not found" };
  }

  const absoluteSchemaPaths = (
    await fs.readdir(absoluteFilesPath, {
      encoding: "utf8",
    })
  )
    .map((filename) =>
      path.join(absoluteFilesPath, filename, `${filename}.schema.json`),
    )
    .filter(fs.existsSync);

  const schemas = (
    await Promise.all(
      absoluteSchemaPaths.map(async (p) => {
        const schema = await readJsonFile<MainCapableJsonSchema>(p);

        const objectSchema = schema?.properties?.items?.items;
        if (!objectSchema) {
          return;
        }
        const modelKeys = Object.keys(objectSchema.properties);

        return {
          name: withoutSubExtensions(path.parse(p).base),
          schema,
          modelKeys,
          objectSchema,
        };
      }),
    )
  ).filter(notEmpty);

  // crude
  const actionSchemaCreateFunction =
    await getIndexedSwcStatement<SwcFunction>("actionSchemaCreate");

  const createSchema = actionSchemaCreateFunction?.parameters?.[0]
    ?.schema as OpenapiSchemaObject;
  const createReturnType = (actionSchemaCreateFunction?.returnType?.schema || {
    $ref: "#/components/schemas/StandardResponse",
  }) as OpenapiSchemaObject;

  const actionSchemaReadFunction =
    await getIndexedSwcStatement<SwcFunction>("actionSchemaRead");
  const readSchema = actionSchemaReadFunction?.parameters?.[0]
    ?.schema as OpenapiSchemaObject;
  const readReturnType = (actionSchemaReadFunction?.returnType?.schema || {
    $ref: "#/components/schemas/StandardResponse",
  }) as OpenapiSchemaObject;

  const actionSchemaUpdateFunction =
    await getIndexedSwcStatement<SwcFunction>("actionSchemaUpdate");
  const updateSchema = actionSchemaUpdateFunction?.parameters?.[0]
    ?.schema as OpenapiSchemaObject;
  const updateReturnType = (actionSchemaUpdateFunction?.returnType?.schema || {
    $ref: "#/components/schemas/StandardResponse",
  }) as OpenapiSchemaObject;

  const actionSchemaDeleteFunction =
    await getIndexedSwcStatement<SwcFunction>("actionSchemaDelete");
  const deleteSchema = actionSchemaDeleteFunction?.parameters?.[0]
    ?.schema as OpenapiSchemaObject;
  const deleteReturnType = (actionSchemaDeleteFunction?.returnType?.schema || {
    $ref: "#/components/schemas/StandardResponse",
  }) as OpenapiSchemaObject;

  const actionSchemaExecuteFunction = await getIndexedSwcStatement<SwcFunction>(
    "actionSchemaExecute",
  );
  const executeSchema = actionSchemaExecuteFunction?.parameters?.[0]
    ?.schema as OpenapiSchemaObject;
  const executeReturnType = (actionSchemaExecuteFunction?.returnType
    ?.schema || {
    $ref: "#/components/schemas/StandardResponse",
  }) as OpenapiSchemaObject;

  const crudeDefinitions = renameRefs({
    ...actionSchemaCreateFunction?.otherDefs,
    ...actionSchemaReadFunction?.otherDefs,
    ...actionSchemaUpdateFunction?.otherDefs,
    ...actionSchemaDeleteFunction?.otherDefs,
    ...actionSchemaExecuteFunction?.otherDefs,
  }) as any;
  const modelPaths = schemas
    .map((schema) => {
      const kebabName = schema.name;

      //Create the enum for keys for the model
      const modelKeyEnum: CapableJsonSchema = {
        type: "string",
        enum: schema.modelKeys,
      };
      //Create the ModelItemPartial
      const modelItemPartial = schema.objectSchema;
      const modelRefs = {
        "#/definitions/ModelKey": modelKeyEnum,
        "#/definitions/ModelItemPartial": modelItemPartial,
      };
      const pathsObjectPart = {
        [`/v1/${kebabName}`]: {
          post: {
            // security:[]
            summary: `Create ${schema.name}`,
            description: createSchema.description,
            operationId: `create${pascalCase(schema.name)}`,
            // Not sure how this below part works!!!
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: renameRefs(
                    withoutProperties(replaceRefs(createSchema, modelRefs), [
                      "projectRelativePath",
                    ]),
                  ),
                } satisfies OpenapiMediaType,
              },
            },

            responses: {
              "200": {
                description: "Standard response",
                content: {
                  "application/json": {
                    schema: renameRefs(
                      replaceRefs(createReturnType, modelRefs),
                    ),
                  },
                },
              },
            },
          },

          get: {
            summary: `Read ${schema.name}`,
            description: readSchema.description,
            operationId: `read${pascalCase(schema.name)}`,
            // Not sure how this below part works!!!
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: renameRefs(
                    withoutProperties(replaceRefs(readSchema, modelRefs), [
                      "projectRelativePath",
                    ]),
                  ),
                } satisfies OpenapiMediaType,
              },
            },

            responses: {
              "200": {
                description: "Standard response",
                content: {
                  "application/json": {
                    schema: renameRefs(replaceRefs(readReturnType, modelRefs)),
                  },
                },
              },
            },
          },

          patch: {
            summary: `Update ${schema.name}`,
            description: updateSchema.description,
            operationId: `update${pascalCase(schema.name)}`,
            // Not sure how this below part works!!!
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: renameRefs(
                    withoutProperties(replaceRefs(updateSchema, modelRefs), [
                      "projectRelativePath",
                    ]),
                  ),
                } satisfies OpenapiMediaType,
              },
            },

            responses: {
              "200": {
                description: "Standard response",
                content: {
                  "application/json": {
                    schema: renameRefs(
                      replaceRefs(updateReturnType, modelRefs),
                    ),
                  },
                },
              },
            },
          },

          delete: {
            summary: `Delete ${schema.name}`,
            description: deleteSchema.description,
            operationId: `delete${pascalCase(schema.name)}`,
            // Not sure how this below part works!!!
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: renameRefs(
                    withoutProperties(replaceRefs(deleteSchema, modelRefs), [
                      "projectRelativePath",
                    ]),
                  ),
                } satisfies OpenapiMediaType,
              },
            },

            responses: {
              "200": {
                description: "Standard response",
                content: {
                  "application/json": {
                    schema: renameRefs(
                      replaceRefs(deleteReturnType, modelRefs),
                    ),
                  },
                },
              },
            },
          },

          put: {
            summary: `Execute ${schema.name}`,
            description: executeSchema.description,
            operationId: `generate${pascalCase(schema.name)}`,
            requestBody: {
              required: true,

              content: {
                "application/json": {
                  schema: renameRefs(
                    withoutProperties(replaceRefs(executeSchema, modelRefs), [
                      "projectRelativePath",
                    ]),
                  ),
                } satisfies OpenapiMediaType,
              },
            },

            responses: {
              "200": {
                description: "Standard response",
                content: {
                  "application/json": {
                    schema: renameRefs(
                      replaceRefs(executeReturnType, modelRefs),
                    ),
                  },
                },
              },
            },
          },
        },
      } as OpenapiDocument["paths"];

      return pathsObjectPart;
    })
    .filter(notEmpty);

  const paths = mergeObjectsArray(modelPaths);

  const openapi: OpenapiDocument = {
    openapi: "3.1.0",
    info: {
      title: context.me_personSlug,
      version: "1",
      description: `OpenAPI for ${context.me_personSlug}`,
      contact: {},
      // license:{}
      //  termsOfService,
      summary: "This contains all schemas!",
    },

    servers: [
      {
        url: `https://${context.me_personSlug}.${context.host}`,
        description: "Production server",
      },
      {
        url: `http://${context.me_personSlug}.actionschema.localhost:42000`,
        description: "Local server",
      },
    ],

    paths,
    // NB: this ensures the bearer security must be applied everywhere
    //https://docs.readme.com/main/discuss/61ae673d092a3b000f1c0844
    //https://swagger.io/docs/specification/authentication/
    security: [{ bearerAuth: [] }],

    components: {
      // NB: this is needed to tell the user they need bearer authentication
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Bearer",
          description: "Your authToken should be provided",
        },
      },

      // callbacks:{test:{}},
      //       examples:{test:{}},
      //       headers:{test:{}},
      //       links:{test:{}},
      //       parameters:{test:{}},
      //       pathItems:{test:{}},
      //       requestBodies:{test:{}},
      //       responses:{test:{}},

      schemas: {
        StandardResponse: {
          type: "object",
          required: ["isSuccessful"],
          properties: {
            isSuccessful: { type: "boolean" },
            message: { type: "string" },
            priceCredit: { type: "number" },
          },
        },
        // TODO: all model schemas should go here

        ...crudeDefinitions,
      },
    },
  };
  return { isSuccessful: true, message: "Done", openapi };
};

makeOpenapi.config = {} satisfies StandardFunctionConfig;
