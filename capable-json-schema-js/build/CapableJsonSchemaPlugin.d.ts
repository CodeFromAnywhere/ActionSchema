export type PluginOpenapiDetails = {
    url: string;
    path: string;
    method: string;
    operationId: string;
    emoji?: string;
};
export type CapableJsonSchemaPlugin = {
    type: "creation" | "validation" | "destination" | "upload" | "table";
    /** This can be the information required to access execute the function */
    $openapi?: PluginOpenapiDetails;
    /**
     * Should be NamedParameters<functionName>
     *
     * To make things deterministic, we can also reference the original uploaded file in a syntax like this: `File<projectRelativePath>`.
     */
    $ref?: string;
    /**
    Map function stored as a string:
    
    E.g.:
    
    `response.results[0].title`
    
    This can be evaluated in javascript, like:
    
    
    `const mapFunction = (response) => response.results[0].title`
    `const realResponse = mapFunction(response);`
    
    This way we can always get what we want.
    */
    ouptputMapFunction?: string;
    /** if given, must resolve to true in order to run this function */
    condition?: string;
    /**
       simple localizer on the object. if defined, will use it as path in the object/array, like `a.b.c[0].d` */
    outputLocation?: string;
    /**
     * If true, this plugin should cause a vertical expansion
     *
     * This means, for each row it is ran on, it will copy that row for each item in the resulting array.
     *
     * NB: If vertical expand is enabled, initial calculation will still work, including expansion, but recalculation is disabled as it would create exponential expansion.
     */
    isVerticalExpandEnabled?: boolean;
    /** In case of destination plugins it can be useful to run it every so many times */
    runEveryPeriod?: "day" | "week" | "hour" | "instant";
    /**
     * Context given to the function. For strings, you'll be able to use variables here
     * (using `${propertyName}` syntax). This needs to be known by the AI.
     *
     * For row generation functions that have a partition function this needs to be generated on the fly (so it will be empty)
     */
    context?: {
        [key: string]: any;
    };
    /** For row generations with a partition function, this is the config */
    partitionContext?: {
        [key: string]: any;
    };
    /**
     * Keeps track of which partition function results have already been executed.
     */
    partitionContextsDone?: {
        [key: string]: any;
    }[];
    /**
     * Property keys in the same object that are required as context.
     *
     * This is needed to know what can be auto-generated. We can only generate if all used variables aren't undefined/null.
     *
     * The trick is to put actual logic in the functions themselves, not outside, in order to just require variables, not logic.
     *
     * This can be inferred from the context as it contains variables that refer to other properties
     */
    propertyDependencies?: string[];
    /**
     * Cost estimation to run this plugin.
     *
     * This is needed to give insight in costs for generations.
     */
    priceCredit?: number;
};
//# sourceMappingURL=CapableJsonSchemaPlugin.d.ts.map