# Roadmap

0. Finish the dev-frontend for editing an ActionSchema
1. Make it work in the browser
2. Make it work in serverless
3. Make it work in node using a better balancer

# EXPOSURE:

- Put `actionschema2` readme on GitHub with `serverless` environment
- Put this demo live on demo.actionschema.com and redirect ActionSchema there until I have something better.
- Put blogs on Medium and Dev.to

# Typescript <-> JSON Schema IO

- ✅ Auto-generate typescript types from this, see if it is good. It may not work with recursive references.
- Figure out the best way to have schemas with definitions that makes it easy to use them as actionschemas but also easily make types from it.... including the inter-references!!!!
- Host the schemas online so I don't need to do `file://` stuff. Host these types in `/root` and make them available via `actionschema.root.actionschema.com/*.schema.json`
- Put them as `$schema` everywhere so I can properly edit JSON in-editor.
