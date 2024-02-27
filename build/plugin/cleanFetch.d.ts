/**
 * A fetch that always shows if there's something wrong with HTTP stuff etc
 */
export declare const cleanFetch: (details: {
    apiUrl: string;
    headers: string;
    method: string;
}, context: any) => Promise<{
    isSuccessful: boolean;
    result: any;
    error?: string | undefined;
    responseText?: string | undefined;
    context?: any;
    headers?: any;
}>;
//# sourceMappingURL=cleanFetch.d.ts.map