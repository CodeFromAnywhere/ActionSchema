# Pseudocode queue + plugin execution

https://github.com/piscinajs/piscina
https://github.com/poolifier/poolifier-bun

1. Queue is made by the `spawner`:

- Every 50ms, look for status `stale`
- Ensure the queue picks it up
- Set status `queued`

1. Plugin execution is like this (`executeGridPlugin`):

- Set status to `busy`
- Execute worker
  - Fetch api
  - Set the data
  - Update status

3. Every update we do this (`setValue`):

- Set new data
- Update status

4. Update status:

- Remove busy status
- Look at other columns that have this datapoint in `propertyDependencies`
- Set those status to `stale`
