# ActionSchema

ActionSchema intends to be a new standard allowing developers to create data-centric codebases. ActionSchema is a superset of [JSON-Schema](https://json-schema.org) connecting meaning to how this meaning is obtained through [OpenAPIs](https://www.openapis.org/) and code execution.

![](actionschema.drawio.svg)

# Motivation

- It's hard and complex to build long chains on top of unreliable functions such as LLM's and other transformer AI, if you can't see what is happening in each part of the chain.
- It's hard to work with OpenAPIs while the potential is giant.
- Increased locality of behavior: keep your code where you describe your data and keep a SSOT. (See [LoB Principle](https://htmx.org/essays/locality-of-behaviour/))

# Installation & Usage

Installation differs depending on where you intend to use `actionschema`. ActionSchema can be ran on a server, on serverless, or directly from the browser!

**Browser**

Install: `npm i actionschema idb`

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

- Storage agnostic
- Runs in browser, serverless, and server environments
- Plugins everywhere (compatible with openapi and jsonschema architecture)
- Built-in load balancing
- Built-in staleness detection
- Improved variable evaluation

Compared to ActionSchema v1, this means it...

- Removes layers of complexity: grid-frontend, user-authentication.
- Makes overview more holistic (including the OpenAPI spec, where changes are required as well)

**Maybe**

- Built-in trusted code-execution
- Built-in scheduling
- Built-in migration support (moving data around)
- Allows you to use it from VSCode
  - x-plugin selector
  - validator
  - in-data actions

Stay tuned for updates!
