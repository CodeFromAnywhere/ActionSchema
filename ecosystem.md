# Highlevel

| Website                                               | Purpose                                         | Status | POC                                                                                                                   | LOC   |
| ----------------------------------------------------- | ----------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- | ----- |
| [Agent OpenAPI](https://agent.actionschema.com)       | Turn any API into an Agent                      | 🟠     | 🟢 Simple POC<br>🟢 OpenAPI-centric Refactor<br>🔴 Threads<br>🔴 Files                                                | 1984  |
| [CRUD OpenAPI](https://data.actionschema.com)         | Turn database into agent-tools                  | 🟠     | 🟢 CRUD Only first<br>🟢 Semantic search<br>🔴 CLI<br>🔴 Config: oAuth user separation<br>🔴 ActionSchema integration | 4450  |
| [Agent Relay](https://telecom.actionschema.com)       | Make agent available anywhere                   | 🟠     | 🟢 Phonecall STS<br>🟢 Custom agent compatibility<br>🟢 Whatsapp, SMS, Messenger<br>🔴 Browser STS<br>🔴 Email        | 450   |
| [Combination Proxy](https://proxy.actionschema.com)   | Combine multiple OpenAPIs into one              | 🔴     | 🟠 Serve with form to make your own easily.<br>🔴 Examples of agents.                                                 | 1300  |
| [Enhancement Proxy](https://openapi.actionschema.com) | Allow agents to iteratively improve their tools | 🔴     | 🟠 Serve on subdomain with frontpage<br>🔴 Create OpenAPI to self-modify                                              | ±2k   |
| [OpenAPI Explorer](https://explorer.actionschema.com) | Explore OpenAPI Possibilities                   | 🔴     | 🟠 Forms<br>🔴 Page-per-tag, all forms on tagpage.<br>🔴 Expose LLM search endpoint.                                  | 664   |
| [Human OpenAPI](https://human.actionschema.com)       | Turn people into agent-tools                    | 🔴     | 🔴 Site where people can get an openapi for themselves or others.                                                     | 11600 |

A dependency to the above is what I call "OpenAPI-first development". It is an opinionated way of [design-first](https://swagger.io/blog/code-first-vs-design-first-api/) development where your OpenAPI serves as the SSOT for a lot of things, and you don't generate it, you rather generate pieces in your code FROM it. Here are some libraries I've made to allow for this.

| Library                                                                      | Purpose                                                    | Status                                                                                            | LOC  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---- |
| [openapi-util](https://github.com/CodeFromAnywhere/openapi-util)             | Utilities for working with OpenAPI and serving them        | 🟢 make `resolveOpenapiAppRequest`<br>                                                            | 1517 |
| [react-openapi-form](https://github.com/CodeFromAnywhere/react-openapi-form) | Auto-generate forms based on an OpenAPI                    | 🟢 Works, including Type Safety and editability<br>🟠 Include component for showing all endpoints | 838  |
| [actionschema](https://github.com/CodeFromAnywhere/ActionSchema)             | Extension of JSON Schema allowing data-centric development | 🟠 Rewrite to v2 in progress<br>🔴 x-proxy<br>🔴 x-schema<br>🔴 x-code<br>                        | 2904 |

If I feel _fancy_, work on this. More experimental:

| Website           | Subdomain | Repo                      | Status     | POC or next steps                                                    | Depends on                      |
| ----------------- | --------- | ------------------------- | ---------- | -------------------------------------------------------------------- | ------------------------------- |
|                   | web       | serverless-scraper        |            | Serverless Playwright Scraping OpenAPI.                              |
|                   |           |                           |            | E2E testing/validating an OpenAPI's functionality                    | ActionSchema?                   |
|                   |           | procedures                | Brainstorm | Natural Language to Operations mapping                               | Good OpenAPI search             |
|                   |           |                           | Brainstorm | LLM Hierarchy Creation, Maintenance, and Search                      |                                 |
| ActionSchema Demo | demo      | actionschema-demo         | Paused     | VSCode plugin for OpenAPI selection and form-filling                 | Functional OpenAPI              |
|                   |           |                           |            | Slow-agents that can continue very long or self-activate             |                                 |
|                   |           |                           |            | Agents openapi unlocks hierarchical actionschema                     |                                 |
|                   |           |                           |            | Some agentic patterns are super useful to implement                  | Agent OpenAPI                   |
| User Openapi      |           | user-openapi              | Brainstorm | Wrapper that adds user-signup and monetisation to stateless openapis |                                 |
| Universal API     |           | Universal-API or Open-LAM |            | Exposes all services through a single cacheable NLP endpoint         | OpenAPI Explorer, Search, Proxy |

Strategy: **ActionSchema** for _Devs_: **OEF**

- Devs want _Open_ source. Give it.
- Devs want _Easy_: Serve it BYOK, accessible, and useful.
- Devs want _Freedom_. Provide them agents so they can go Screenless.

**ActionSchema in different keywords: AI Software Engineer, Universal API, Reliable Agents, OLAM**

TODO: Keep jumping between these projects and aim to finish them asap. **Laserfocus**.

LONGTERM: Keep these stable services for decades. Keep LOC/Complexity LOW.

# Key insights

- Most AI is focused around realtime co-pilots because we're all still used to the direct HMC. Try making ambient pilots that don't need to be fast.
- Pick my focus. Big topics like browser automation APIs and video editing are done by hundreds of companies and are extremely hard to stay competitive in; It's a never-ending cat and mouse game.
- Products and APIs change all the time. Instead of choosing to spend knowledgework time in specific niches, index all available capabilities.
- Most users care about their privacy and would want to have things ran locally. However, running locally is hard to setup and scale. Another way to have practical privacy is to keep the core local, but run smaller fleeting tasks in the cloud.
- How any API works exactly doesn't need to be abstracted away from. The only thing we need to do is determine API capability, quality, speed, cost, and availability.

# Key focus: Reliable Agents by intelligent search

- Analysing thousands of services on capability, quality, speed, cost, and availability.
- Have a scalable way to sign up and get access to all service providers with multiple accounts.
- Proxy them into my own gateway which can be made available as a "Universal API" that exposes all services through a single endpoint.

# Questions

- How can I build a meta programming language that dynamically finds new actions, tests them, and improves them, that can create purpose-oriented change in a system?
  - How can I measure purpose-oriented change and figure out whether it's worth the cost?
