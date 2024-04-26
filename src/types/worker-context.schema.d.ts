/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * @minItems 1
 */
export type SchemaArray = [ActionSchema1, ...ActionSchema1[]];
export type StringArray = string[];

export interface WorkerContext {
  completeContext: {
    [k: string]: unknown;
  };
  databaseId: string;
  dotLocation: string;
  schema: ActionSchema;
  [k: string]: unknown;
}
/**
 * Core json-schema meta-schema, adapted to make it an ActionSchema with plugin capabilities. Root taken from https://json-schema.org/draft-07/schema#definitions
 */
export interface ActionSchema {
  /**
   * Useful at root. Dot-notation of where to find the items.
   */
  "x-grid-items-location"?: string;
  /**
   * Useful at root. If this is true, its a schema that is allowed to be read by anyone regardless of the data privacy.
   */
  "x-is-public"?: boolean;
  "x-plugin"?: Plugin;
  /**
   * Besides serving as default values for e.g. forms and other things, with ActionSchema `default` also serves as a fallback of `x-plugin`. If x-plugin is empty or it fails, and `default` is available, the default will be set as the value.
   */
  default?: ActionSchema1 | boolean | number | unknown[] | string;
  /**
   * Sample JSON values associated with a particular schema, for the purpose of illustrating usage.
   *
   * Besides serving as example values for e.g. forms and other things, with ActionSchema `examples` also serves as a fallback of `x-plugin` and `default`.
   */
  examples?: unknown[];
  deprecated?: boolean;
  /**
   * Determines how it's shown in forms. See: https://rjsf-team.github.io/react-jsonschema-form/docs/usage/widgets/
   */
  "ui:widget"?: string;
  /**
   * Determines how it's shown in forms. See: https://rjsf-team.github.io/react-jsonschema-form/docs/usage/widgets/
   */
  "ui:options"?: {
    /**
     * If given, it is assumed the value or values of this property link to this model.
     */
    refModelName?: string;
    [k: string]: unknown;
  };
  $id?: string;
  /**
   * If given, should be a url linking to the original file, the starting point, if this is not already the one. Used to determine if anything has changed.
   */
  $source?: string;
  $schema?: string;
  $ref?: string;
  /**
   * Comment for the makers of the schema
   */
  $comment?: string;
  /**
   * In the form this shows up as the title for the property. More readable.
   */
  title?: string;
  /**
   * Description for schema at this location
   */
  description?: string;
  readOnly?: boolean;
  writeOnly?: boolean;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number | boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: ActionSchema1;
  items?: ActionSchema1 | SchemaArray | boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: ActionSchema1;
  maxProperties?: number;
  minProperties?: number;
  required?: StringArray;
  additionalProperties?: ActionSchema1 | boolean;
  definitions?: {
    [k: string]: ActionSchema1;
  };
  properties?: {
    [k: string]: ActionSchema1;
  };
  patternProperties?: {
    [k: string]: ActionSchema1;
  };
  dependencies?: {
    [k: string]: ActionSchema1 | StringArray;
  };
  propertyNames?: ActionSchema1;
  const?: ActionSchema1 | boolean;
  /**
   * @minItems 1
   */
  enum?: [unknown, ...unknown[]];
  type?:
    | ("array" | "boolean" | "integer" | "null" | "number" | "object" | "string")
    | [
        "array" | "boolean" | "integer" | "null" | "number" | "object" | "string",
        ...("array" | "boolean" | "integer" | "null" | "number" | "object" | "string")[]
      ];
  format?: string;
  contentMediaType?: string;
  contentEncoding?: string;
  if?: ActionSchema1;
  then?: ActionSchema1;
  else?: ActionSchema1;
  allOf?: SchemaArray;
  anyOf?: SchemaArray;
  oneOf?: SchemaArray;
  not?: ActionSchema1;
}
/**
 * Plug-in an openapi here to say how  this value can be determined.
 */
export interface Plugin {
  summary?: string;
  /**
   * Could be used to auto-describe the usage of this plugin
   */
  description?: string;
  /**
   * For plugins for an array. If true, will replace items in the array fully.
   *
   * By default, ActionSchema will insert into an array with an optional discriminator (see below).
   */
  arrayReplace?: boolean;
  /**
   * For plugins for an array. If given, must be a key of the object in the array. Will now overwrite/replace object-items where a discriminator matches, while keeping the rest as-is.
   */
  arrayDiscriminatorPropertyKey?: boolean & string;
  /**
   * If true, will replace the object rather than overwriting it where needed.
   *
   * By default, ActionSchema will overwrite only the given individual properties of an object. In this case, the other properties will be set to stale if needed.
   */
  objectReplace?: boolean;
  $openapi?: OpenAPIDetails;
  /**
   * If given, must resolve to true in order to run this function
   */
  condition?: string;
  /**
   * Simple localizer on the object. if defined, will use it as path in the object/array, like `a.b.c[0].d`
   */
  outputLocation?: string;
  /**
   * If true, this plugin should cause a vertical expansion. This means, for each row it is ran on, it will copy that row for each item in the resulting array. NB: If vertical expand is enabled, initial calculation will still work, including expansion, but recalculation is disabled as it would create exponential expansion.
   */
  isVerticalExpandEnabled?: boolean;
  /**
   * If true, will not auto-execute when dependencies are met. Useful for example for scheduled columns
   */
  isAutoExecuteDisabled?: boolean;
  /**
   * Context given to the function. For strings, you'll be able to use variables here (using `${propertyName}` syntax). This needs to be known by the AI.
   */
  context?: {
    [k: string]: unknown;
  };
  /**
   * Array of dot locations of datapoints that are required to be non-stale for this plugin to run. Should replace `propertyDependencies`. Might later calculate this in realtime using the `x-plugin.code` property
   */
  dataDependencies?: string[];
  /**
   * Cost estimation to run this plugin. This is needed to give insight in costs for generations.
   */
  priceCredit?: number;
  /**
   * This could be the code executed upon receiving any context of the schema as context. If we can create an editor that has the proper typescript context and shows the function based on the body, we have a single source of truth for the codebase. We code inside the actionschemas or openapis! The beauty is, this is programming language agnostic and we have a much more readable way to get interfaces.
   */
  code?: {
    host?: "browser" | "serverless" | "server" | "gpu";
    code?: string;
    [k: string]: unknown;
  };
  /**
   * @deprecated
   * For grid-plugins: if true, entire grid data will be provided into the plugin
   */
  isGridDataProvided?: boolean;
  /**
   * @deprecated
   * Property keys in the same object that are required as context. This is needed to know what can be auto-generated. We can only generate if all used variables aren't undefined/null.
   */
  propertyDependencies?: string[];
  /**
   * @deprecated
   * What should the dependant values do when this value changes? If 'stale', there needs to be an `isStalePropertyName` given, so we can set it to stale.
   */
  onChangeDependantBehavior?: "ignore" | "stale" | "reset" | "delete";
  /**
   * @deprecated
   * If given, this could be a reference to another property that resolves to a boolean that, if true, tells that this value is stale.
   */
  stalePropertyName?: string;
  /**
   * @deprecated
   * If given, this could be a reference to another property that resolves to a boolean that, if false, tells that this value is invalid
   */
  validPropertyName?: string;
  [k: string]: unknown;
}
/**
 * The OpenAPI information required to execute the function.
 */
export interface OpenAPIDetails {
  url: string;
  path: string;
  method: string;
  operationId: string;
  emoji?: string;
  [k: string]: unknown;
}
/**
 * Core json-schema meta-schema, adapted to make it an ActionSchema with plugin capabilities. Root taken from https://json-schema.org/draft-07/schema#definitions
 */
export interface ActionSchema1 {
  /**
   * Useful at root. Dot-notation of where to find the items.
   */
  "x-grid-items-location"?: string;
  /**
   * Useful at root. If this is true, its a schema that is allowed to be read by anyone regardless of the data privacy.
   */
  "x-is-public"?: boolean;
  "x-plugin"?: Plugin;
  /**
   * Besides serving as default values for e.g. forms and other things, with ActionSchema `default` also serves as a fallback of `x-plugin`. If x-plugin is empty or it fails, and `default` is available, the default will be set as the value.
   */
  default?: ActionSchema1 | boolean | number | unknown[] | string;
  /**
   * Sample JSON values associated with a particular schema, for the purpose of illustrating usage.
   *
   * Besides serving as example values for e.g. forms and other things, with ActionSchema `examples` also serves as a fallback of `x-plugin` and `default`.
   */
  examples?: unknown[];
  deprecated?: boolean;
  /**
   * Determines how it's shown in forms. See: https://rjsf-team.github.io/react-jsonschema-form/docs/usage/widgets/
   */
  "ui:widget"?: string;
  /**
   * Determines how it's shown in forms. See: https://rjsf-team.github.io/react-jsonschema-form/docs/usage/widgets/
   */
  "ui:options"?: {
    /**
     * If given, it is assumed the value or values of this property link to this model.
     */
    refModelName?: string;
    [k: string]: unknown;
  };
  $id?: string;
  /**
   * If given, should be a url linking to the original file, the starting point, if this is not already the one. Used to determine if anything has changed.
   */
  $source?: string;
  $schema?: string;
  $ref?: string;
  /**
   * Comment for the makers of the schema
   */
  $comment?: string;
  /**
   * In the form this shows up as the title for the property. More readable.
   */
  title?: string;
  /**
   * Description for schema at this location
   */
  description?: string;
  readOnly?: boolean;
  writeOnly?: boolean;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number | boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: ActionSchema1;
  items?: ActionSchema1 | SchemaArray | boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: ActionSchema1;
  maxProperties?: number;
  minProperties?: number;
  required?: StringArray;
  additionalProperties?: ActionSchema1 | boolean;
  definitions?: {
    [k: string]: ActionSchema1;
  };
  properties?: {
    [k: string]: ActionSchema1;
  };
  patternProperties?: {
    [k: string]: ActionSchema1;
  };
  dependencies?: {
    [k: string]: ActionSchema1 | StringArray;
  };
  propertyNames?: ActionSchema1;
  const?: ActionSchema1 | boolean;
  /**
   * @minItems 1
   */
  enum?: [unknown, ...unknown[]];
  type?:
    | ("array" | "boolean" | "integer" | "null" | "number" | "object" | "string")
    | [
        "array" | "boolean" | "integer" | "null" | "number" | "object" | "string",
        ...("array" | "boolean" | "integer" | "null" | "number" | "object" | "string")[]
      ];
  format?: string;
  contentMediaType?: string;
  contentEncoding?: string;
  if?: ActionSchema1;
  then?: ActionSchema1;
  else?: ActionSchema1;
  allOf?: SchemaArray;
  anyOf?: SchemaArray;
  oneOf?: SchemaArray;
  not?: ActionSchema1;
}
