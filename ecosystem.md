# Highlevel

| Website                                               | Purpose                                         | Status | POC                                                                                                                                                           | LOC      |
| ----------------------------------------------------- | ----------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [Agent OpenAPI](https://agent.actionschema.com)       | Turn any API into an Agent                      | 🟠     | 🟢 Simple POC<br>🔴 OpenAPI-centric Refactor<br>🔴 Streaming, threads, files                                                                                  | 2530     |
| [CRUD OpenAPI](https://data.actionschema.com)         | Turn database into agent-tools                  | 🟠     | 🟢 CRUD Only first<br>🔴 CLI<br>🔴 Config: oAuth user separation<br>🔴 Semantic search<br>🔴 ActionSchema integration                                         | 4450     |
| [Agent Relay](https://telecom.actionschema.com)       | Make agent available anywhere                   | 🟠     | 🟢 Phonecall STS<br>🟠 Custom agent compatibility<br>🔴 Browser STS<br>🔴 Whatsapp<br>🔴 Email                                                                | 450      |
|                                                       | OpenAPI-first development                       | 🟠     | 🟢 make and use `openapi-util` everywhere<br>🟢 make `react-openapi-form`<br>🟢 make `resolveOpenapiAppRequest`<br>🔴 x-proxy<br>🔴 x-schema<br>🔴 x-code<br> | 1500+850 |
| [Combination Proxy](https://proxy.actionschema.com)   | Combine multiple OpenAPIs into one              | 🔴     | 🟠 Serve with form to make your own easily.<br>🔴 Examples of agents.                                                                                         | 1300     |
| [Enhancement Proxy](https://openapi.actionschema.com) | Allow agents to iteratively improve their tools | 🔴     | 🟠 Serve on subdomain with frontpage<br>🔴 Create OpenAPI to self-modify                                                                                      | ±2k      |
| [OpenAPI Explorer](https://explorer.actionschema.com) | Explore OpenAPI Possibilities                   | 🔴     | 🟠 Forms<br>🔴 Page-per-tag, all forms on tagpage.<br>🔴 Expose LLM search endpoint.                                                                          | 664      |
| [Human OpenAPI](https://human.actionschema.com)       | Turn people into agent-tools                    | 🔴     | 🔴 Site where people can get an openapi for themselves or others.                                                                                             | 11600    |

If I feel _fancy_, work on this. More experimental:

| Website           | Subdomain | Repo                      | Status     | POC or next steps                                            | Depends on                      |
| ----------------- | --------- | ------------------------- | ---------- | ------------------------------------------------------------ | ------------------------------- |
|                   | web       | serverless-scraper        |            | Serverless Playwright Scraping OpenAPI.                      |
|                   |           |                           |            | E2E testing/validating an OpenAPI's functionality            | ActionSchema?                   |
|                   |           | procedures                | Brainstorm | Natural Language to Operations mapping                       | Good OpenAPI search             |
|                   |           |                           | Brainstorm | LLM Hierarchy Creation, Maintenance, and Search              |                                 |
| ActionSchema Demo | demo      | actionschema-demo         | Paused     | VSCode plugin for OpenAPI selection and form-filling         | Functional OpenAPI              |
|                   |           |                           |            | Slow-agents that can continue very long or self-activate     |                                 |
|                   |           |                           |            | Agents openapi unlocks hierarchical actionschema             |                                 |
|                   |           |                           |            | Some agentic patterns are super useful to implement          | Agent OpenAPI                   |
| Universal API     |           | Universal-API or Open-LAM |            | Exposes all services through a single cacheable NLP endpoint | OpenAPI Explorer, Search, Proxy |

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
- If all I do is use APIs, I don't require

# Key focus: Reliable Agents by intelligent search

- Analysing thousands of services on capability, quality, speed, cost, and availability.
- Have a scalable way to sign up and get access to all service providers with multiple accounts.
- Proxy them into my own gateway which can be made available as a "Universal API" that exposes all services through a single endpoint.

# Questions

- How can I build a meta programming language that dynamically finds new actions, tests them, and improves them, that can create purpose-oriented change in a system?
  - How can I measure purpose-oriented change and figure out whether it's worth the cost?
