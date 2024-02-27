export declare const initDb: (databaseId: string) => Promise<boolean>;
export declare const indexedDbPutData: <T>(databaseId: string, key: string, value: T) => Promise<{
    isSuccessful: boolean;
    message: string;
    result?: T | undefined;
}>;
export declare const indexedDbDeleteData: (databaseId: string, key: string) => Promise<boolean>;
/** Probably don't need for now */
export declare const indexedDbUpdateData: <T>(databaseId: string, key: string, data: T) => Promise<string | T | null>;
/** Gets all store data */
export declare const indexedDbGetStoreData: <T>(databaseId: string) => Promise<T[]>;
/** Gets one key store data */
export declare const indexedDbGetStoreItem: <T>(databaseId: string, key: string) => Promise<T[]>;
//# sourceMappingURL=indexedDb.d.ts.map