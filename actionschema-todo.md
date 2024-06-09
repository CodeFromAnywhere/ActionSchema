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
