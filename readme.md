# ActionSchema

![](actionschema.drawio.svg)

ActionSchema intends to be a new standard allowing developers to create data-centric codebases. ActionSchema is a superset of JSON-Schema connecting meaning to how this meaning is obtained through OpenAPIs and code execution.

# Installation & Usage

Installation differs depending on where you intend to use `actionschema`. ActionSchema can be ran on a server, on serverless, or directly from the browser!

**Browser**

Install: `npm i actionschema`

Usage:

```ts
import { executeBrowser } from "actionschema/build/environments/browser/executeBrowser";
executeBrowser(context);
```

**Serverless**

Install: `npm i actionschema`

Usage:

```ts
import { executeServerless } from "actionschema/build/environments/serverless/executeServerless";
executeServerless(context);
```

**Server**

Install: `npm i actionschema piscina`

Usage:

```ts
import { executeServer } from "actionschema/build/environments/server/executeServer";
executeServer(context);
```

# Roadmap

⚠️ Rewrite in progress ⚠️

**Goals of the rewrite**:

- Removes layers of complexity: grid-frontend, user-authentication.
- Storage agnostic
- Plugins everywhere (compatible with openapi and jsonschema architecture)
- Keep it simple for a holistic overview (including the OpenAPI spec)
- Runs in browser, serverless, and server environments
- Built-in load balancing
- Built-in staleness detection
- Built-in trusted code-execution

**Maybe**

- Built-in scheduling
- Built-in migration support (moving data around)
- Allows you to use it from VSCode
  - x-plugin selector
  - validator
  - in-data actions

Stay tuned for updates!
