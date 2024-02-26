type DotKey = string | number;
type Token = string;
type Tokens = Token[];
/**
 * Tokenize path string
 */
export declare const tokenize: (str: string) => Tokens;
/**
 * Getter
 */
export interface DotGetOptions {
    iterateObject?: boolean;
    iterateArray?: boolean;
}
export declare const get: (data: any, path: DotKey, value?: any | undefined, options?: DotGetOptions) => any;
/**
 * Setter
 */
export declare const set: (data: any, path: DotKey, value: any) => any;
export declare const remove: (data: any, path: DotKey) => any;
/**
 * Check value
 */
export declare const has: (data: any, path: DotKey) => boolean;
export declare const flatten: (data: any) => {
    [key: string]: string;
};
/**
 * Expand vaules
 */
export declare const expand: (data: any) => any;
/**
 * Executes a provided function once for each element.
 */
export declare const forEach: (data: any, path: DotKey, iteratee: (value: any, key: DotKey, context: any, path: string, data: any | any[]) => boolean | void, options?: DotGetOptions) => void;
/**
 * Create a new element
 * with the results of calling a provided function on every element.
 */
export declare const map: (data: any, path: DotKey, iteratee: (value: any, key: DotKey, context: any, path: string, data: any | any[]) => any, options?: DotGetOptions) => any[];
/**
 * Match key
 */
export declare const matchPath: (pathA: string, pathB: string) => boolean;
/**
 * Escape path string
 */
export declare const escapePath: (path: string) => string;
/**
 * Build path from Tokens like array
 */
export declare const buildPath: (tokens: (string | number)[]) => string;
/**
 * Check contains of wildcard syntax
 */
export declare const containWildcardToken: (path: string) => boolean;
export {};
//# sourceMappingURL=dot-wild.d.ts.map