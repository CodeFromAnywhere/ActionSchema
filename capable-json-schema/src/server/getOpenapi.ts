import { Context, Env } from "hono";
import { fs, path, writeJsonToFile } from "fs-util";
import { projectRoot } from "get-path";
import { makeOpenapi, renameRefs, replaceRefs } from "../makeOpenapi.js";
import { readJsonFile } from "read-json-file";
import {
  OpenapiDocument,
  OpenapiMediaType,
  OpenapiSchemaObject,
} from "schema-types";
// NB: NOT GOOD TO REQUIRE THIS HERE!
import { getSdkRequireFunctions } from "development";
import { json } from "./helpers.js";
import {
  getIndexedSwcStatement,
  swcGet,
  tryRequireFunctionsWithConfig,
} from "swc-util";
import { SwcFunction, SwcInterface } from "swc-types";
import { mergeObjectsArray, notEmpty } from "js-util";
import { humanCase } from "convert-case";
import {
  CapableJsonSchema,
  JSONSchema7Type,
  MainCapableJsonSchema,
} from "capable-json-schema-js";

export const getOpenapi = async (c: Context<Env, "/openapi.json", {}>) => {
  const request = c.req;

  const url = new URL(request.url);
  const hostname = url.hostname;
  const [tld, mainDomain, subdomain] = hostname.split(".").reverse();

  const isApi =
    hostname === "api.codefromanywhere.com" ||
    hostname === "api.codefromanywhere.localhost";

  const isSdk =
    hostname === "sdk.codefromanywhere.com" ||
    hostname === "sdk.codefromanywhere.localhost";

  if (isApi || isSdk) {
    //api/sdk
    /*
- gather all plugins here
- tag them with prod/beta/alpha and add tag `stateful`
- put them in readme docs, redirecting from `api.codefromanywhere.com`
*/

    const fns = isSdk
      ? await getSdkRequireFunctions()
      : await tryRequireFunctionsWithConfig(
          ([name, item]) => !!item.config?.plugin,
        );

    if (!fns) {
      return json({ isSuccessful: false, message: "No functions" });
    }

    const executeFunctionResult = (
      await getIndexedSwcStatement<SwcInterface>("ExecuteFunctionResult")
    )?.type?.typeDefinition;

    if (!executeFunctionResult) {
      return json({ isSuccessful: false, message: "No ExecuteFunctionResult" });
    }

    // executeFunctionResult.
    const statements = await swcGet("SwcStatement");

    const swcFunctions = (
      await Promise.all(
        fns.map(async (x) => {
          if (!x.packageCategory || !x.packageName) {
            return;
          }

          const swcFunction = statements?.find(
            (s) =>
              s.packageCategory === x.packageCategory &&
              s.packageName === x.packageName &&
              s.name === x.name,
          ) as SwcFunction | undefined;

          return swcFunction;
        }),
      )
    ).filter(notEmpty);

    const modelPaths = swcFunctions.map((swcFunction) => {
      const kebabName = swcFunction.name;

      // NB: need to copy, otherwise it'll refer to the same object
      const finalResponseSchema = {
        ...executeFunctionResult,
        properties: {
          ...executeFunctionResult.properties,
          result: swcFunction.returnType?.schema
            ? renameRefs(swcFunction.returnType.schema as OpenapiSchemaObject)
            : { $ref: "#/components/schemas/StandardResponse" },
        },
      };

      // console.log(swcFunction.name, {
      //   hasReturnType: !!swcFunction.returnType?.schema,
      //   returnType: swcFunction.returnType?.schema,
      //   finalResponseSchema,
      // });

      const bodySchema = renameRefs(swcFunction.parameters?.[0]?.schema as any);

      const isNotProduction =
        (swcFunction.config?.productionStatus || "production") !== "production";
      const noProductionSuffix = isNotProduction
        ? ` (${swcFunction.config?.productionStatus})`
        : "";

      const firstCategory = swcFunction.config?.categories?.[0] || "general";

      const pathsObjectPart = {
        [`/function/${kebabName}`]: {
          post: {
            tags: [firstCategory],
            summary: `${humanCase(swcFunction.name)}${noProductionSuffix}`,
            description:
              swcFunction.config?.descriptionMarkdown ||
              swcFunction.config?.shortDescription ||
              swcFunction.comment,

            operationId: swcFunction.name,

            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: bodySchema,
                } satisfies OpenapiMediaType,
              },
            },

            responses: {
              "200": {
                description: "Standard response",
                content: {
                  "application/json": {
                    schema: finalResponseSchema,
                  },
                },
              },
            },
          },
        },
      } as OpenapiDocument["paths"];

      const definitions = swcFunction.otherDefs;

      return { pathsObjectPart, definitions };
    });

    const paths = mergeObjectsArray(
      modelPaths.map((x) => x.pathsObjectPart).filter(notEmpty),
    );

    const otherDefs = mergeObjectsArray(
      modelPaths.map((x) => x.definitions).filter(notEmpty),
    );

    const openapi: OpenapiDocument = {
      openapi: "3.1.0",
      info: {
        title: "CodeFromAnywhere API",
        version: "1",
        description: `OpenAPI for all AI from Code From Anywhere`,
        contact: {},
        // license:{}
        // termsOfService,
        summary: "This contains all schemas!",
      },

      servers: [
        {
          url: `https://api.codefromanywhere.com`,
          description: "Production server",
        },
        // This does not work and would only work with a https url. Localhost cannot be reached through readme.io
        // {
        //   url: `http://api.codefromanywhere.localhost:42000`,
        //   description: "Local server",
        // },
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
          ...otherDefs,
        },
      },
    };

    return json(openapi);
  }

  if (!subdomain) {
    return json({
      isSuccessful: false,
      message:
        tld === "localhost"
          ? "Not found. Please go to [slug].actionschema.localhost:3000"
          : "OpenAPI not found",
    });
  }
  const personFolder = path.join(projectRoot, "memory/persons", subdomain);

  if (!fs.existsSync(personFolder)) {
    return json({
      isSuccessful: false,
      message: "OpenAPI not found",
    });
  }

  const openapiPath = path.join(personFolder, "openapi.json");

  // make openapi
  const makeResult = await makeOpenapi({
    host: `${mainDomain}.${tld}`,
    me_personSlug: subdomain,
  });

  const isSuccessful = await writeJsonToFile(openapiPath, makeResult.openapi);

  if (!fs.existsSync(openapiPath)) {
    return json({
      isSuccessful,
      message: "OpenAPI not found",
    });
  }

  const openapi = await readJsonFile<OpenapiDocument>(openapiPath);

  if (!openapi) {
    return json({
      isSuccessful: false,
      message: "OpenAPI not found",
    });
  }

  return json(openapi);
};
