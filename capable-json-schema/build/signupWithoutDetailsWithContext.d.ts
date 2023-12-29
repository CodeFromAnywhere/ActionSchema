import { FunctionContext } from "function-types";
export declare const signupWithoutDetailsWithContext: {
    (functionContext: FunctionContext): Promise<{
        isSuccessful: boolean;
        message: string;
    }>;
    config: {
        isPublic: true;
    };
};
export declare const signupGuest: (authToken: string) => Promise<void>;
//# sourceMappingURL=signupWithoutDetailsWithContext.d.ts.map