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

Install:

`npm install --save-exact actionschema`

`npm i idb`

Usage:

```ts
import { executeBrowser } from "actionschema/browser";
executeBrowser(context);
```

**Serverless**

Install: `npm install --save-exact actionschema`

Usage:

```ts
import { executeServerless } from "actionschema/serverless";
executeServerless(context);
```

**Server**

Install:

`npm install --save-exact actionschema`

`npm i piscina`

Usage:

```ts
import { executeServer } from "actionschema/server";
executeServer(context);
```

# Roadmap

⚠️ Rewrite in progress ⚠️

See [choices](choices.md) for more info on the choices made during this rewrite so far.

**Goals of the rewrite**:

- Ability to add plugins everywhere (compatible with openapi and jsonschema architecture)
- Storageless in-memory serverless execution
- Improved variable evaluation: see [relative-json-pointers](relative-json-pointers.md)
- Introduction of actionschemas as an openapi extension (`x-schema`)

Compared to ActionSchema v1, this means it...

- Removes layers of complexity: grid-frontend, user-authentication, and storage.
- Is more suitable to be used in a scalable way
- Becomes much more simple

**After that these are high on the list:**

- Ability to run in browser, serverless, and server environments
- Storage agnostic
- Built-in load balancing
- Built-in staleness detection
- Built-in trusted code-execution
- Built-in scheduling
- Built-in migration support (moving data around)
- Allows you to use it from VSCode
  - x-plugin selector
  - validator
  - in-data actions

Stay tuned for updates!

# Ecosystem

Check [the ecosystem](ecosystem.md) for the status of other tools within the ActionSchema Toolkit.
