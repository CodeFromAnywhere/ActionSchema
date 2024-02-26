export declare const initDb: (storeName: string) => Promise<boolean>;
export declare const putData: <T>(storeName: string, key: string, value: T) => Promise<{
    isSuccessful: boolean;
    message: string;
    result?: T | undefined;
}>;
export declare const deleteData: (storeName: string, key: string) => Promise<boolean>;
/** Probably don't need for now */
export declare const updateData: <T>(storeName: string, key: string, data: T) => Promise<string | T | null>;
/** Gets all store data */
export declare const getStoreData: <T>(storeName: string) => Promise<T[]>;
//# sourceMappingURL=indexedDb.d.ts.map