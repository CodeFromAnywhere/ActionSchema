`actionschema` will be my new source of truth for `CapableJsonSchema` and `OpenAPIDocument`.

It'd be great to nerd out on this a little, and try making a full actionschema rewrite... It'd be fun and refreshing, just what I need! It might also turn out to become much more powerful...

# TODO ActionSchema 2.0

- ✅ Add VSCode Monaco Editor on the left panel: Color highlighting and JSON-Schema adherence!
- ✅ Deploy `actionschema` as npm package named `actionschema` and at `https://github.com/CodeFromAnywhere/ActionSchema`
- ✅ Deploy `actionschema-web` on Vercel at `demo.actionschema.com`
- ✅ Improved support for editor: fetching code from remote sources and storing it in local storage
- ✅ Use https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event to detect if the position has changed so we can show a different plugin
- ✅ `editor.js` change it so it uses `storageKey` instead

# Layout

- ✅ Make the splitview swipable
- ✅ Ensure the content of both sides fit on a screen-height and screen-width (with proper overflow if needed)

# Form `x-plugin`

- ✅ find a feasible way to get jsonpath of cursor location
- ✅ get offset into store
- ✅ `getDotLocation` should work in js too. Fix `dot-wild.ts`
- ✅ Calculate which `x-plugin` the cursor is positioned and set it to state.
- ✅ Use `rjsf` component for `x-plugin` I previously made and show the form for this `x-plugin`
- ✅ Ensure it alters the original JSON of the schema (and saves it) every time you alter something in the form. **can be done, json will never become invalid**
- ✅ Does the JSONSchema left listen to `localStorage` changes?
- ✅ No saving button will be needed.
- ✅ Show JSON position on top.
- ✅ If on your position there's no plugin, add a button "New Plugin".
- ✅ If a plugin was selected ensure you can close it there.
- ✅ Saving the JSON-Schema refreshes the form fully **(only after saving as JSON may become invalid!)**
- ✅ Clicking somewhere where no xplugin is found, should make the previous go away also

# Setup and CTA

- ✅ Ability to opt-out to sending anonymous usage data for research & development purposes
- ✅ Ability to set external API for execution (can be server and serverless)
- ✅ Make `>` button `executeBrowser({dotLocation:"",newValue:null})` so it does it from the start, without data.
- ✅ Make `>` button optionally use `fetchExecute` if we have set the config for that

# Plugin calling

- ✅ `editor.js` Use listener to detect if the `storageKey` data has been updated. If so, refresh the contents! (Except if you saved yourself...)
- ✅ IndexedDb `getStoreItem(databaseId,key)` to browser implementation
- ✅ Add `executeBrowser` init for database depending on the `databaseId`
- ✅ Add `fetchPlugin` doing the plugin-call properly via the cors-proxy or not (depending on incoming request)
- Ensure `executeBrowser` sets `localStorage:dataKey` every update alongside the indexedDb dotLocation...
- `execute`: Support `JSON-Schema.default:[]` and `JSON-schema.examples:[]`
- Create a test ActionSchema that uses some simple APIs and builds up a JSON from the start.

At this point, fix it so that `>` shows updates in realtime on the right

# Deploy this

- Figure out the best way to deploy all this. As I have shared code between `os-web` and `actionschema-web`...
  - shall I make it part of the monorepo?
  - shall I copy and duplicate?
  - shall I make structure simpler and have a single package?

<!-- GET HERE TODAY??? -->

# Improved plugin calling

- Its important that `executeBrowser` has a callback to refresh the right editor, every time an update in the data takes place.
- `setDatabaseValue` Implement options. This is crucial for and should be well thought-through before deciding on it.
- Create a function that builds up the entire JSON from all indexedDb items so a full JSON can be retreived. Ensure to allow for a custom `$schema` and set that to `__editor__`
- `editor.js`: Add schema resolver so `__editor__` resolves to `localStorage:schema.[url]`. Try to make it so it updates whenever schema updates.

# OpenAPI setup

- Ensure it's possible to set up your OpenAPIs here.
- Ensure it's possible to pass in the token according to the OpenAPI auth flows
- Pass these things into the form

# Make this the 'editor' for development in localhost.

We can add APIs so it can also edit schemas in localhost through an `fs-api`. Ideally, this would be an `OpenAPI`, so anyone can connect their own storage solution. This would allow creating a new software development experience, creating schemas everywhere.

Root schemas can now move to `os-web/public`

On the server it could be connected to `memory/persons/[__id]/files`

# ActionSchema: Plugin type interfaces & variables <!-- Blocking me to do many new things-->

- If no plugin is selected, it should be a JSONSchema builder so you can make a type. For now, lets only support `integer/number/string/boolean/string[]`
- If a plugin is selected, the type should be inferrable from the plugin itself + its outputlocation (and this should be automatically set in the backend)
- Grid should have typing! Its putting strings in number places now. Credit isn't deducted. Terrible.
- Variables don't work in a nested way. This should be possible: `"context": {"items": ["${meetingInfo}"],"shouldExecuteGridEntireRow": "true"}`. Also the condition needs to work.
- Support for negation in condition: `${!virtualMeetingPin}`
- Fix loading indicator and refresh after status update!
- `condition` is blocking if present.
- For contexts with variables in nested objects/arrays, `propertyDependencies` aren't added.
- For properties that are objects or arrays, we need to be able to go in them when writing this variable.

# Create schedule

Improve `scheduleExecute` and `actionSchemaExecute`: Search entire actionschema for `x-plugin` instances by adhering to new property: `scheduleLocation` so the plugin to be executed can be everywhere.

After this, plugins in `variables` and on the array should work.

# Schedule cleanup

- ✅ Openapi Standard: add `x-unmountOperationId` into the openapi
- Ensure `x-unmountOperationId` is added based on function config of `scheduleExecute`
- Ensure `scheduleExecuteUnmount` is also part of the openapi
- ActionSchema: ensure for all places where values are removed or edited, we also call `x-unmountOperationId`s operation.
  - updating an item
  - remove an item
  - remove a column
- Also create `x-unmountOperationId` for Dall-e3 and Deepgram TTS

# Property auto-execute disablement

- Now `calendar-event.onFire` shouldn't auto-execute when executing the entire row. In actionschema apply property `isAutoExecuteDisabled` to `actionSchemaExecute`

# Grid editing

- Ability to set a type to `#/RelationSelector` with `x-modelName` and having the UI to fix it
- Ability to set a type to `#/AudioRecordingUrl` which should render a recording button to record and upload it
- In the grid, if some field is JSON, allow for raw JSON editing as well as a `rjsf` form.

#

After I have this basic setup in which I can run any OpenAPI through my localhost, the goal would be to get it to a point it works with all the requirements. I can try to implement it doing OpenAPI enrichment, creating an OpenAPI proxy for any OpenAPI, and evaluate the different endpoints. 🤯 An OpenAPI file could be all thats needed for deploying an ultra-scalable server + website + pricing... Everything. My entire day could be spent reorganising OpenAPIs, together with AI. No more coding.
