/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * ☢️ Allows easy creation new OpenAPIs that have a selection of paths from multiple OpenAPIs, and proxy the incoming requests to the right path of another server with authentication.
 */
export interface OpenapiProxySchema {
  /**
   * Name of the proxy
   */
  name: string;
  /**
   * List of multiple paths from multiple openapis
   */
  partialApis: PartialApi[];
  info: Info;
  /**
   * Secret API that - if given - must be met to gain access.
   */
  apiKey?: string;
}
/**
 * Only openapiUrl is required. If security isn't given but needed, securitySchemes will be passed on. If operations aren't given, all operations will be included.
 */
export interface PartialApi {
  openapiUrl: string;
  security?: SecurityRequirement;
  operations?: {
    path: string;
    /**
     * Incase the path is not unique, the proxy will suffix something to the path. This is stored here.
     */
    proxyPath?: string;
    method: string;
    /**
     * An array of modifications to the input schema
     */
    modifications?: {
      name: string;
      /**
       * Omit will omit the property, default will set a default but keep it possible to change, fixed will set a default that can't be changed.
       */
      modification: "omit" | "default" | "fixed";
      value?: string;
    }[];
  }[];
}
/**
 * Filled in security details based on the OpenAPIs securitySchemes.
 */
export interface SecurityRequirement {
  [k: string]: string[];
}
/**
 * Info object of the to be served openapi
 */
export interface Info {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
  /**
   * The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).
   */
  version: string;
  /**
   * Different people in the company and their capabilities and communication channels
   */
  "x-people"?: Contact1[];
  /**
   * Product info.
   */
  "x-product"?: {
    [k: string]: any;
  };
  /**
   * Important links needed for agents to make using the API easier.
   */
  "x-links"?: {
    signupUrl?: string;
    loginUrl?: string;
    forgotPasswordUrl?: string;
    pricingUrl?: string;
    /**
     * Page from where logged-in user can make purchases, cancel subscription, etc.
     */
    billingUrl?: string;
    /**
     * URL of a page where the user can see their usage and its cost.
     */
    usageUrl?: string;
    docsUrl?: string;
    supportUrl?: string;
    /**
     * Url of the page where the user can find the required information for authorizing on the API. Usually this is a page where the user can create and see their API tokens.
     */
    apiAuthorizationSettingsUrl?: string;
  };
  /**
   * Pricing info including monthly fees.
   */
  "x-pricing"?: {
    /**
     * General summary of all plans
     */
    description?: string;
    plans?: {
      price: number;
      currency: string;
      title: string;
      /**
       * How much credit do you get for this. Credit matches the credit spent with 'priceCredit' extension for operations
       */
      credit: number;
      /**
       * How long will you retain the credit you receive?
       */
      persistence?: "forever" | "interval" | "capped";
      /**
       * Required when filling in persistence 'capped'
       */
      persistenceCappedDays?: number;
      /**
       * If the plan is a subscription based plan, fill in the interval on which every time the price is paid, and credit is given.
       *
       * If there is a pay-as-you-go price, fill in the minimum purchase size for each step. It will be assumed the price to credit ratio is linear.
       */
      interval?: "week" | "month" | "quarter" | "year";
      rateLimit?: RateLimit;
    }[];
  };
  "x-rateLimit"?: RateLimit1;
  /**
   * General product reviews, collected.
   */
  "x-reviews"?: {
    [k: string]: any;
  };
  /**
   * General latency info.
   */
  "x-latency"?: {
    [k: string]: any;
  };
  /**
   * Link to other openapis that could be good alternatives.
   */
  "x-alternatives"?: {
    [k: string]: any;
  }[];
  /**
   * Logo metadata. Standard taken from https://apis.guru
   */
  "x-logo"?: {
    /**
     * URL to a logo image
     */
    url?: string;
    backgroundColor?: string;
    secondaryColor?: string;
  };
  /**
   * This interface was referenced by `Info`'s JSON-Schema definition
   * via the `patternProperty` "^x-".
   */
  [k: string]: any;
}
/**
 * Contact information for the exposed API.
 */
export interface Contact {
  name?: string;
  url?: string;
  email?: string;
  "x-phoneNumber"?: string;
  "x-description"?: string;
  /**
   * This interface was referenced by `Contact`'s JSON-Schema definition
   * via the `patternProperty` "^x-".
   *
   * This interface was referenced by `Contact1`'s JSON-Schema definition
   * via the `patternProperty` "^x-".
   */
  [k: string]: any;
}
/**
 * The license information for the exposed API.
 */
export interface License {
  name: string;
  url?: string;
  /**
   * This interface was referenced by `License`'s JSON-Schema definition
   * via the `patternProperty` "^x-".
   */
  [k: string]: any;
}
export interface Contact1 {
  name?: string;
  url?: string;
  email?: string;
  "x-phoneNumber"?: string;
  "x-description"?: string;
  /**
   * This interface was referenced by `Contact`'s JSON-Schema definition
   * via the `patternProperty` "^x-".
   *
   * This interface was referenced by `Contact1`'s JSON-Schema definition
   * via the `patternProperty` "^x-".
   */
  [k: string]: any;
}
/**
 * Plan-based RateLimit info that overwrites the general rateLimit.
 */
export interface RateLimit {
  limit?: number;
  interval?: "second" | "minute";
  [k: string]: any;
}
/**
 * Global ratelimit info. Can be overwritten either by plans or by operations.
 */
export interface RateLimit1 {
  limit?: number;
  interval?: "second" | "minute";
  [k: string]: any;
}
