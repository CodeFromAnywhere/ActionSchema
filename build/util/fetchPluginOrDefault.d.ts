import { EnvironmentConfig, ExecuteContext } from "../types/types.js";
export declare const fetchPluginOrDefault: (context: ExecuteContext & EnvironmentConfig) => Promise<{
    value: undefined;
    hasStaleStatus: true;
    isSuccessful: boolean;
    message: string;
} | {
    value: any;
    isSuccessful: boolean;
    message: string;
    hasStaleStatus?: undefined;
}>;
//# sourceMappingURL=fetchPluginOrDefault.d.ts.map