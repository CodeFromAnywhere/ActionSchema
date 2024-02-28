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
- ✅ `execute`: Support `JSON-Schema.default:[]`
- ✅ Added array object expansion
- ✅ Added object expansion

# Process results better

- ✅ Flatten result before storing (`{x: [{a:1},{b:2}] }` becomes `x[0].a = 1` and `x[1].b = 2`)
- ✅ Create a function that gets all indexedDb values (with a certain - optional - prefix) and builds the object from it
- ✅ Using the object-builder, set `localStorage:dataKey` every update so we see it change!

🎉 Now I should see JSON change in realtime!

# Fix Plugin Call

- ✅ Position is also changed if i'm in the other editor. fix so position is editor-specific
- ✅ Resetting should also reset all in the underlying store. Fix that.
- ✅ Status should be shown in header: `x loading, y waiting`. Fetch this each time the data updates.
- ✅ Its important that `executeBrowser` has a callback to refresh the right editor, every time an update in the data takes place.
- ✅ Create a function that builds up the entire JSON from all indexedDb items so a full JSON can be retreived.
- ❌ 😵‍💫 Put the right headers and context in the CFA API ❌ 😵‍💫 Struggle with the proxy... **can't get it to work yet**

🎉 Now I should be able to do real API calls to all CFA Plugins

# Output location

- ✅ When deselecting a plugin, remove it fully.
- ✅ Adhere to outputLocation in `execute`
- ✅ Bug: when saving with incorrect JSON: ensure to first fix in `editor.js`, don't crash (tryParseJson)
- ✅ Alter `jsonGptPlugin` and other plugins so all of them have the correct responseSchema in the OPENAPI
- ✅ In `CapableJsonSchemaInput`: calculate the type based on `outputLocation`
- ✅ Ensure outputLocation sets JSON type through PluginForm `responseSchema`
- ❌ If no plugin is selected, it should be a JSONSchema builder so you can make a type. For now, lets only support `integer/number/string/boolean/string[]` **No need anymore. Can do in the left with this view**
- ✅ If a plugin is selected, the type should be inferrable from the plugin itself + its outputlocation
- ✅ Grid should have typing! Its putting strings in number places now. Credit isn't deducted. Terrible.

# Variables

I need to find the perfect way to do variables. Previously I supported just the row. I need to make it possible to select anything for full JSON Support. I guess either proximity based or relative is best, especially if we have to deal with arrays...

Proximity based can probably be done through looking for unique names with similar stuff.

- PluginForm: Remove $refs from openapi from responseSchema, if present. Otherwise we might have bad definitions
- Variables don't work in a nested way. This should be possible: `"context": {"items": ["${meetingInfo}"],"shouldExecuteGridEntireRow": "true"}`. Also the condition needs to work.
- Support for negation in condition: `${!virtualMeetingPin}`
- Fix loading indicator and refresh after status update!
- `condition` is blocking if present.
- For contexts with variables in nested objects/arrays, `propertyDependencies` aren't added.
- For properties that are objects or arrays, we need to be able to go in them when writing this variable.

# Stress test

- Create a default of 1000 rows or so
- See if it breaks or gets slow, and if so, how can we resolve this?
- Also openapis can break. Rate limit openapis to x rps by default, and create capability to specify in OpenAPI spec.

<!-- GET HERE TODAY??? -->

# Deploy this

- Figure out the best way to deploy all this. As I have shared code between `os-web` and `actionschema-web`...
  - shall I make it part of the monorepo?
  - shall I copy and duplicate?
  - shall I make structure simpler and have a single package?

# Improved plugin calling

`setDatabaseValue` Implement `ValueConfig`. This is crucial for and should be well thought-through before going for this.

```ts
/** Should be inferred from x-plugin */
export type ValueOptions = {
  /**
   * If true, will replace the object rather than overwriting it where needed.
   *
   * By default, ActionSchema will overwrite only the given individual properties of an object. In this case, the other properties will be set to stale if needed.
   */
  objectReplace?: boolean;
  /**
    If true, will replace items in the array fully.
    
    By default, ActionSchema will insert into an array with an optional discriminator (see below).
    */
  arrayReplace?: boolean;

  /**
   * If given, must be a key of the object in the array. Will now overwrite/replace object-items where a discriminator matches, while keeping the rest as-is.
   */
  arrayDiscriminatorPropertyKey?: string;
};
```

# Realtime schema resolver

Nice to have... Not prio now

- Ensure to allow for a custom `$schema` and set that to `__editor__`
- Add schema resolver so `__editor__` resolves to `localStorage:schema.[url]`.
- Try to make it so it updates whenever schema updates.

# OpenAPI setup

- Ensure it's possible to set up your OpenAPIs here.
- Ensure it's possible to pass in the token according to the OpenAPI auth flows
- Pass these things into the form

# Make this the 'editor' for development in localhost.

We can add APIs so it can also edit schemas in localhost through an `fs-api`. Ideally, this would be an `OpenAPI`, so anyone can connect their own storage solution. This would allow creating a new software development experience, creating schemas everywhere.

Root schemas can now move to `os-web/public`

On the server it could be connected to `memory/persons/[__id]/files`

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
