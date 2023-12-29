import { JSONSchema7TypeName } from "json-schema";
/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema7Type = string | number | boolean | {
    [key: string]: JSONSchema7Type;
} | JSONSchema7Type[] | null;
/** Interface to easily extend the JSON Schema */
export type ExtendedJSONSchema7<T, TExamples = JSONSchema7Type | undefined> = {
    $id?: string | undefined;
    $ref?: string | undefined;
    $schema?: string | undefined;
    $comment?: string | undefined;
    /**
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
     */
    $defs?: {
        [key: string]: ExtendedJSONSchema7<T>;
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
    items?: ExtendedJSONSchema7<T> | ExtendedJSONSchema7<T>[] | undefined;
    additionalItems?: ExtendedJSONSchema7<T> | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    contains?: ExtendedJSONSchema7<T> | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
     */
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [key: string]: ExtendedJSONSchema7<T>;
    } | undefined;
    patternProperties?: {
        [key: string]: ExtendedJSONSchema7<T>;
    } | undefined;
    additionalProperties?: ExtendedJSONSchema7<T> | undefined;
    dependencies?: {
        [key: string]: ExtendedJSONSchema7<T> | string[];
    } | undefined;
    propertyNames?: ExtendedJSONSchema7<T> | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
     */
    if?: ExtendedJSONSchema7<T> | undefined;
    then?: ExtendedJSONSchema7<T> | undefined;
    else?: ExtendedJSONSchema7<T> | undefined;
    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
     */
    allOf?: ExtendedJSONSchema7<T>[] | undefined;
    anyOf?: ExtendedJSONSchema7<T>[] | undefined;
    oneOf?: ExtendedJSONSchema7<T>[] | undefined;
    not?: ExtendedJSONSchema7<T> | undefined;
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
        [key: string]: ExtendedJSONSchema7<T>;
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
    examples?: TExamples;
} & T;
//# sourceMappingURL=ExtendedJSONSchema7.d.ts.map