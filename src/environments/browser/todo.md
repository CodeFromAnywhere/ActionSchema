# TODO ActionSchema 2.0

- ✅ Add VSCode Monaco Editor on the left panel: Color highlighting and JSON-Schema adherence!
- Add `getStoreItem(databaseId,key)` to browser implementation
- Add `fetchPlugin` doing the plugin-call properly
- `execute`: Support `JSON-Schema.default:[]` and `JSON-schema.examples:[]` and demonstrate this with a simple example
- `setDatabaseValue` Implement options. This is crucial for and should be well thought-through before deciding on it.
- Create a test ActionSchema that uses some simple APIs and builds up a JSON from the start.
- Make `>` button reset data and `executeBrowser({dotLocation:""})` so it does it from the start, without data. Its important that `executeBrowser` has a callback to refresh the right editor, every time an update in the data takes place.

After I have this basic setup in which I can run any OpenAPI through my localhost, the goal would be to get it to a point it works with all the requirements.
