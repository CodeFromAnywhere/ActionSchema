/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * @minItems 1
 */
export type SchemaArray = [ActionSchema, ...ActionSchema[]];

export interface WorkerContext {
  completeContext: {
    [k: string]: any;
  };
  databaseId: string;
  dotLocation: string;
  schema: ActionSchema;
  [k: string]: any;
}
/**
 * Core json-schema meta-schema, adapted to make it an ActionSchema with plugin capabilities. Root taken from https://json-schema.org/draft-07/schema#
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
  "x-plugin"?: Plugin | Plugin[];
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
    [k: string]: any;
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
  default?: ActionSchema | boolean | number | any[] | string;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: any[];
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number | boolean;
  maxLength?: number;
  minLength?: number & number;
  pattern?: string;
  additionalItems?: ActionSchema;
  items?: ActionSchema | SchemaArray | boolean;
  maxItems?: number;
  minItems?: number & number;
  uniqueItems?: boolean;
  contains?: ActionSchema;
  maxProperties?: number;
  minProperties?: number & number;
  required?: string[];
  additionalProperties?: ActionSchema | boolean;
  definitions?: {
    [k: string]: ActionSchema;
  };
  properties?: {
    [k: string]: ActionSchema;
  };
  patternProperties?: {
    [k: string]: ActionSchema;
  };
  dependencies?: {
    [k: string]: ActionSchema | string[];
  };
  propertyNames?: ActionSchema;
  const?: ActionSchema | boolean;
  /**
   * @minItems 1
   */
  enum?: [any, ...any[]];
  type?:
    | (
        | "array"
        | "boolean"
        | "integer"
        | "null"
        | "number"
        | "object"
        | "string"
      )
    | [
        (
          | "array"
          | "boolean"
          | "integer"
          | "null"
          | "number"
          | "object"
          | "string"
        ),
        ...(
          | "array"
          | "boolean"
          | "integer"
          | "null"
          | "number"
          | "object"
          | "string"
        )[],
      ];
  format?: string;
  contentMediaType?: string;
  contentEncoding?: string;
  if?: ActionSchema;
  then?: ActionSchema;
  else?: ActionSchema;
  allOf?: SchemaArray;
  anyOf?: SchemaArray;
  oneOf?: SchemaArray;
  not?: ActionSchema;
}
/**
 * ActionSchema plugin
 */
export interface Plugin {
  /**
   * Could be used to auto-describe the usage of this plugin
   */
  description?: string;
  /**
   * Could be used to auto-summarise the usage of this plugin
   */
  summary?: string;
  /**
   * For grid-plugins: if true, entire grid data will be provided into the plugin
   */
  isGridDataProvided?: boolean;
  /**
   * For plugins for an array. If true, result will be concatenated to the array, not replaced. Please beware that this makes things less deterministic.
   */
  concatenateArray?: boolean;
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
    [k: string]: any;
  };
  /**
   * Property keys in the same object that are required as context. This is needed to know what can be auto-generated. We can only generate if all used variables aren't undefined/null.
   */
  propertyDependencies?: string[];
  /**
   * Cost estimation to run this plugin. This is needed to give insight in costs for generations.
   */
  priceCredit?: number;
  /**
   * TODO: Optionally, this could be an alternative for using '$openapi' (or a complement). This could be code that can be evaluated in javascript/typescript on an edge worker. Imagine this being code that can directly run on edge-workers, infinitely scalable? We now don't rely on creating openapis whatsoever. Instead, there is just this single openapi endpoint that is used for everything. Of course openapis can be better in many cases, since it is more standardised, but I think it could be very powerful to have this, especially for custom things that need to happen.
   */
  code?: string;
  /**
   * What should the dependant values do when this value changes? If 'stale', there needs to be an `isStalePropertyName` given, so we can set it to stale.
   */
  onChangeDependantBehavior?: "ignore" | "stale" | "reset" | "delete";
  /**
   * If given, this could be a reference to another property that resolves to a boolean that, if true, tells that this value is stale.
   */
  stalePropertyName?: string;
  /**
   * If given, this could be a reference to another property that resolves to a boolean that, if false, tells that this value is invalid
   */
  validPropertyName?: string;
  [k: string]: any;
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
  [k: string]: any;
}
export interface ActionSchemaPlugin {
  /**
   * The entire URL should be here
   */
  __id?: string;
  headers?: string;
  /**
   * In case this is given and your IS_DEV is set to "true", this URL will be used when executing. However, this URL will never be set into the ActionSchema as this would cause things to not work when pushing to production. This is why it's needed to have this parameter: we want a good development experience at localhost for any openapi we may make, being able to make production-schemas from localhost
   */
  localhostOpenapiUrl?: string;
  /**
   * If true, this indicates we should always use localhost, even in production.
   */
  isInternallyHosted?: boolean;
}
