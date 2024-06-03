# ActionSchema and Proxy Standards

- Adopt new `x-proxy` standard so we can easily "eject" from the hosted combination-proxy if we need our own endpoints.
- Adopt `x-schema` standard so we can define actionschemas inside the openapi.
- Adopt `x-code` standard so we can refer to code from the openapi. Try this to be supported by any server. Try putting the code in `public`

Example:

```json
{
  "paths": {
    "/actionSchema": {
      "post": {
        "description": "Example for an actionschema",
        "x-actionschema-config": {
          "implementation": "wait",
          "schema": {
            "$ref": "https://raw.githubusercontent.com/CodeFromAnywhere/ActionSchema/main/schemas/calendar-event.schema.json#"
          }
        },
        "requestBody": { "content": {}, "description": "TO BE INFERRED" },
        "responses": { "200": { "description": "TO BE INFERRED" } }
      }
    }
  }
}
```

This is great. Now we can define endpoints using openapi in many ways:

- Define io and implement
- Define it to be proxied
- Define it to be executing an actionschema

A single openapi server that adopts this spec is super useful. Since then combinations are possible, it becomes very intuitive to use openapi.json as your go-to place to define your application. Besides that, we now have the ability to host openapis for people that can do custom things for them, without having to run foreign code.

# Combination proxy: KV Store

- Setup an upstash-db with a JSON-Schema for each user so we know what's up.
- Make it so that the openapis created get stored into kv-storage
- Implement looking up the key already there so we can't make duplicate

# Combination Proxy: Request Handler

- Implement `handleProxyRequest(proxy,openapi)`
- Finds the id in kv to retreive openapi and proxy-info
- Fills in parameters if they're there.
- propogates the requests to the right real server and path.
- Make a proxy for `OpenAI.com/Assistant/CRUD` and get an openapi for this that's hosted and functional: listAssistants, createAssistant, getAssistant,modifyAssistant, deleteAssistant.
- Make an assistant for this very OpenAPI via the OpenAPI playground and confirm it's somewhat working.

<!-- This is my super valuable tool for any AI enthousiast already. -->

# Missing link 5: Massive OpenAPI Self-Play

- Automatically come up with scenarios that can be done with an api
- for each action come with an expected result
- Automatically do these scenarios
- Automatically compare expected with reality
- Based on this determine best way to do something
- Automatically filter on reliable ones and combine them for suggesting more high-level scenarios.
- Repeatedly do this with a dynamic budget to ensure evolution.

In the end, it's the same idea as what I had with minion - topdown evaluation of the entire spectrum of apis, and benchmarking how far we get.

Loop:

- explore
- try
- evaluate

# Missing link 6: Hierarchical top-down labeling

The ability to automatically label anything into a hierarchy in a multi-step gpt. Langchain has these things but probably not perfect.

# GTM ideas

Make a PR in APIS.guru and Let `mike.ralphson@gmail.com` know.

Let Antti Sema4.ai know about this as well, once it's there. It'd be very useful to be able to make agents so quickly and can be part of their docs. Maybe I can merge it in into opengpts.

- Talk with multiple SaaS providers with an API about the usefulness of multiple GTM ideas.
- Explore LangChain, Robocorp and the tooling they made and see where it can be complemented.
- `OpenAPIActionSchema` for OpenAPI improvement: examples, testing, docs, and much more.
- Webapp for (open)GPTs to more easily find the right actions for agents.
- Offer Support chat-agent for SaaS
- Offer Execute-Agent for SaaS
- Code recipes generation
- Provide API playground website to SaaS
- Provide paid search-access to Code-gen AIs

https://www.youtube.com/watch?v=bXxq8RQUfXk <-- github 20k stars guy explains.

# OLLAMA

https://ollama.com/blog/openai-compatibility

![](antti.png)

# San Fransisco opportunities

Antti (CEO Robocorp/Sema4.ai) says https://github.com/langchain-ai/opengpts is where they collab, and the `action_server` in robocorps repo will move to sema4.ai. It's a good idea to get familiar with this tooling and see how I can build something for them. LangChain is good anyway as everyone is using it.

The ActionServer is basically my idea with ActionSchema. Allow a good way for agents to understand and use actions, anywhere, and learn from problems. The improved OpenAPI becomes your learning layer.

OpenAI's status quo is now a GPT that poops out an OpenAPI string (refered to from the GPT builder). This limits us to a single server, and we're not able to even combine agents etc: https://chat.openai.com/g/g-TYEliDU6A-actionsgpt

If we make a GPT that finds the best way to accomplish a goal, we're done. We'll have a much better framework.
