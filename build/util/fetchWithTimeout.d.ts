/**
 * Sets timeout to 5 minutes by default
 *
 * Better fetch that also returns status and statusText along with the raw text result and JSON.
 */
export declare const fetchWithTimeout: <T extends unknown>(input: string | Request | URL, init?: RequestInit, timeoutMs?: number, isNoJson?: boolean, isNoText?: boolean) => Promise<{
    text: string | undefined;
    json: T | null;
    status: number | undefined;
    statusText: string;
    response: Response | undefined;
}>;
export declare const fetchTextWithTimeout: (input: string | Request | URL, init?: RequestInit, timeoutMs?: number, isNoText?: boolean) => Promise<{
    statusText: string;
    text?: undefined;
    status?: undefined;
    response?: undefined;
} | {
    text: string | undefined;
    status: number;
    statusText: string;
    response: Response;
} | {
    text: undefined;
    status: number;
    statusText: string;
    response?: undefined;
}>;
//# sourceMappingURL=fetchWithTimeout.d.ts.map