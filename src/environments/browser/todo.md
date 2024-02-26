`actionschema` will be my new source of truth for `CapableJsonSchema` and `OpenAPIDocument`.

It'd be great to nerd out on this a little, and try making a full actionschema rewrite... It'd be fun and refreshing, just what I need! It might also turn out to become much more powerful...

# TODO ActionSchema 2.0

- ✅ Add VSCode Monaco Editor on the left panel: Color highlighting and JSON-Schema adherence!
- ✅ Deploy `actionschema` as npm package named `actionschema` and at `https://github.com/CodeFromAnywhere/ActionSchema`
- ✅ Deploy `actionschema-web` on Vercel at `demo.actionschema.com`
- ✅ Improved support for editor: fetching code from remote sources and storing it in local storage
- ✅ Use https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event to detect if the position has changed so we can show a different plugin

# Realtime Rendering

- `editor.js` change it so it uses `indexedDb` instead of `localStorage` and ensure it would also work with a remote storage...
- `editor.js` Use IndexedDb listener to detect if the `indexedDb` data has been updated. If so, refresh the contents! (Except if you saved yourself...)
- IndexedDb `getStoreItem(databaseId,key)` to browser implementation
- Create a function that builds up the entire JSON from all indexedDb items so a full JSON can be retreived. Ensure to allow for a custom `$schema` and set that to `__editor`
- `editor.js`: Add schema resolver so `__editor__` resolves to `localStorage:schema.[url]`. Try to make it so it updates whenever schema updates.

# Form `x-plugin`

- Calculate which `x-plugin` the cursor is positioned (or not)
- Add `rjsf` component for `x-plugin` I previously made and show the form for this `x-plugin`
- Make it so it alters the `store:schema.[url]` store whenever whe change the form, and vice versa

# Setup

- Ensure it's possible to set up your OpenAPIs here, defaulting to a few known ones like OpenAPI.
- Ensure it's possible to pass in the token according to the OpenAPI auth flows

# Plugin calling

- Add `fetchPlugin` doing the plugin-call properly via the cors-proxy
- `execute`: Support `JSON-Schema.default:[]` and `JSON-schema.examples:[]` and demonstrate this with a simple example
- `setDatabaseValue` Implement options. This is crucial for and should be well thought-through before deciding on it.
- Make `>` button reset data and `executeBrowser({dotLocation:""})` so it does it from the start, without data. Its important that `executeBrowser` has a callback to refresh the right editor, every time an update in the data takes place.
- Create a test ActionSchema that uses some simple APIs and builds up a JSON from the start.

# Make this the 'editor' for development in localhost.

We can add APIs so it can also edit schemas in localhost through an fs-api. Ideally, this would be an `OpenAPI`, so anyone can connect their own storage solution. This would allow creating a new software development experience, creating schemas everywhere.

Root schemas can now move to `os-web/public`

On the server it could be connected to `memory/persons/[__id]/files`

#

After I have this basic setup in which I can run any OpenAPI through my localhost, the goal would be to get it to a point it works with all the requirements. I can try to implement it doing OpenAPI enrichment, creating an OpenAPI proxy for any OpenAPI, and evaluate the different endpoints. 🤯 An OpenAPI file could be all thats needed for deploying an ultra-scalable server + website + pricing... Everything. My entire day could be spent reorganising OpenAPIs, together with AI. No more coding.
