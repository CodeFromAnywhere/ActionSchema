export declare const initDb: (databaseId: string) => Promise<boolean>;
export declare const indexedDbPutData: <T>(databaseId: string, key: string, value: T) => Promise<{
    isSuccessful: boolean;
    message: string;
    result?: T | undefined;
}>;
/** Gets all store data and builds a JSON object from it */
export declare const indexedDbBuildObject: (databaseId: string, dotLocationBase?: string) => Promise<any>;
/** Gets all store data */
export declare const indexedDbGetItems: (databaseId: string) => Promise<any[]>;
/** Gets one key store data */
export declare const indexedDbGetStoreItem: <T>(databaseId: string, key: string) => Promise<T | undefined>;
//# sourceMappingURL=indexedDb.d.ts.map