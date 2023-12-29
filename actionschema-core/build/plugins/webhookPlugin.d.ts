import { StandardContext } from "function-types";
import { O } from "js-util";
/** Allows for actionschema webhooks */
export declare const webhookPlugin: {
    (context: StandardContext & {
        /** URL that will receive a POST request with the row up until now */
        url: string;
        /** If needed, provide an authorization header here, e.g. "Bearer fskjdksljfkdsjfkldsjfjs" */
        authorizationHeader?: string;
        /** Automatically provided */
        row?: O;
    }): Promise<void>;
    config: {
        isPublic: true;
        productionStatus: "beta";
        plugin: "column";
        emoji: string;
        shortDescription: string;
        isInternetRequired: true;
        categories: string[];
    };
};
//# sourceMappingURL=webhookPlugin.d.ts.map