import { CapableJsonSchemaPlugin } from "./CapableJsonSchemaPlugin.js";
import { JSONSchema7TypeName } from "json-schema";
/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema7Type = string | number | boolean | {
    [key: string]: JSONSchema7Type;
} | JSONSchema7Type[] | null;
/**
 * Sideset of `JSONSchema7` that is intended to make a JSONSchema that is aware of how it's data can be generated.
 *
 * Goal: a lossy deterministic-approaching way to define datastructures that can regenerate all data inside it.
 *
 * - redefines "examples"
 * - for arrays and objectparameters, adds creationPlugins
 * - for object parameters, adds validationPlugins and visibility
 */
export type CapableJsonSchema = {
    $id?: string | undefined;
    $ref?: string | undefined;
    $schema?: string | undefined;
    $comment?: string | undefined;
    /**
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
     */
    $defs?: {
        [key: string]: CapableJsonSchema;
    } | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
     */
    type?: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
    enum?: JSONSchema7Type[] | undefined;
    const?: JSONSchema7Type | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
     */
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
     */
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
     */
    items?: CapableJsonSchema | CapableJsonSchema[] | undefined;
    additionalItems?: CapableJsonSchema | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    contains?: CapableJsonSchema | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
     */
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [key: string]: CapableJsonSchema;
    } | undefined;
    patternProperties?: {
        [key: string]: CapableJsonSchema;
    } | undefined;
    additionalProperties?: CapableJsonSchema | undefined;
    dependencies?: {
        [key: string]: CapableJsonSchema | string[];
    } | undefined;
    propertyNames?: CapableJsonSchema | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
     */
    if?: CapableJsonSchema | undefined;
    then?: CapableJsonSchema | undefined;
    else?: CapableJsonSchema | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
     */
    allOf?: CapableJsonSchema[] | undefined;
    anyOf?: CapableJsonSchema[] | undefined;
    oneOf?: CapableJsonSchema[] | undefined;
    not?: CapableJsonSchema | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
     */
    format?: string | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
     */
    contentMediaType?: string | undefined;
    contentEncoding?: string | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
     */
    definitions?: {
        [key: string]: CapableJsonSchema;
    } | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
     */
    title?: string | undefined;
    description?: string | undefined;
    default?: JSONSchema7Type | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    /** examples are customisable */
    examples?: ActionSchemaExamples;
} & CapableJsonSchemaObjectItem;
/** Properties a capable json schema must certainly have at its root */
export interface MainCapableJsonSchema {
    $schema: string;
    type: string;
    properties: {
        $schema: {
            type: string;
        };
        items: {
            type: string;
            items: {
                type: string;
                properties: {
                    [propertyKey: string]: CapableJsonSchema;
                };
            };
        } & CapableJsonSchemaObjectItem;
    };
    additionalProperties?: boolean;
    required?: string[];
    title?: string;
    description?: string;
}
/**
Examples of the value of this property. typed as any, but of course this must be the same type as the value defined in the schema here

NB: overwrites examples of JSONSchema (https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-validation-01#section-10.4)
   */
export type ActionSchemaExamples = {
    value: any;
}[];
export interface CapableJsonSchemaObjectItem {
    /**
     * CAPABLE JSON SCHEMA:Only works for arrays and object properties
     *
     * plugins to create more items. these are the sources
     *
     * NB: this plugin must always return an object with a "result" parameter
     *
     * - In case of column generations, if it's a string, it can be applied directly
     * - In ase of column generations, if it's an object, the right key is chosen using a GPT normalization or GPT mapper
     *
     * - In case of array item generations, array items will be mapped using some sort of GPT Normalisations to the right column(s)
     * - In case of array item generations, objects will be mapped to a single row to the right columns using the same technique
     */
    creationPlugins?: CapableJsonSchemaPlugin[];
}
//# sourceMappingURL=CapableJsonSchema.d.ts.map