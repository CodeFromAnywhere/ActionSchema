This will be my new source of truth for `CapableJsonSchema` and `OpenAPIDocument`.

It'd be great to nerd out on this a little, and try making a full actionschema rewrite... It'd be fun and refreshing, just what I need! It might also turn out to become much more powerful...

**Goals of the rewrite**:

- Removes layers of complexity: grid-frontend, user-authentication.
- Keep it simple for a holistic overview (including the OpenAPI spec)
- Runs in browser, serverless, and server environments
- Built-in load balancing
- Built-in staleness detection
- Built-in scheduling
- Built-in trusted code-execution
<!-- - Built-in migration support (moving data around) -->
- Plugins everywhere (compatible with openapi and jsonschema architecture)
- Includes support for adaptors for storing the items as well as all ActionSchema metadata
- Allows you to use it from VSCode
  - x-plugin selector
  - validator
  - in-data actions

**Proof of concept**:

After implementation, I can try to implement it doing OpenAPI enrichment, creating an OpenAPI proxy for any OpenAPI, and evaluate the different endpoints.

<!-- 🤯 An OpenAPI file could be all thats needed for deploying an ultra-scalable server + website + pricing... Everything. My entire day could be spent reorganising Openapis, together with AI. No more coding. -->
