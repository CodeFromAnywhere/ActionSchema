import { replaceRefs } from "./makeOpenapi.js";

const res = replaceRefs(
  {
    type: "object",
    additionalProperties: false,
    properties: {
      projectRelativePath: {
        type: "string",
      },
      search: {
        type: "string",
      },
      rowIds: {
        type: "array",
        items: {
          type: "string",
        },
      },
      startFromIndex: {
        type: "number",
      },
      maxRows: {
        type: "number",
      },
      filter: {
        type: "array",
        items: {
          type: "object",
          properties: {
            operator: {
              type: "string",
            },
            value: {
              type: "string",
            },
            objectParameterKey: {
              $ref: "#/definitions/ModelKey",
            },
          },
          required: ["operator", "value", "objectParameterKey"],
          additionalProperties: false,
        },
      },
      sort: {
        type: "array",
        items: {
          type: "object",
          properties: {
            sortDirection: {
              type: "string",
              enum: ["ascending", "descending"],
            },
            objectParameterKey: {
              $ref: "#/definitions/ModelKey",
            },
          },
          required: ["sortDirection", "objectParameterKey"],
          additionalProperties: false,
        },
      },
      objectParameterKeys: {
        type: "array",
        items: {
          $ref: "#/definitions/ModelKey",
        },
      },
      ignoreObjectParameterKeys: {
        type: "array",
        items: {
          $ref: "#/definitions/ModelKey",
        },
      },
    },
  },
  {
    "#/definitions/ModelKey": { type: "string", enum: ["a", "b", "c"] },
    "#/definitions/ModelItemPartial": { type: "thing" },
  },
);

console.log(res);
