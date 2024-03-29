/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * 🔗 User centric: which openapis does ActionSchema plug into
 */
export interface ActionSchemaPluginCollection {
  $schema?: string;
  items?: ActionSchemaPlugin[];
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
