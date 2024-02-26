export declare const initDb: (databaseId: string) => Promise<boolean>;
export declare const putData: <T>(databaseId: string, key: string, value: T) => Promise<{
    isSuccessful: boolean;
    message: string;
    result?: T | undefined;
}>;
export declare const deleteData: (databaseId: string, key: string) => Promise<boolean>;
/** Probably don't need for now */
export declare const updateData: <T>(databaseId: string, key: string, data: T) => Promise<string | T | null>;
/** Gets all store data */
export declare const getStoreData: <T>(databaseId: string) => Promise<T[]>;
//# sourceMappingURL=indexedDb.d.ts.map