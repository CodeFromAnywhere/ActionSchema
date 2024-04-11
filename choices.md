In this document I'm giving a summary of all choices made when implementing the rewrite of ActionSchema. As some choices are suboptimal, this serves as a SSOT for potentially improving things at a later stage.

# Multiple JS environments

- In order to use serverless functions this project was made using Next.js.
- In order to use the VSCode Monaco Editor, raw HTML + JS was used because Next.js doesn't easily support the Monaco Editor.

This doesn't allow for easy code sharing. A more elegent solution would be desirable and would require some extra research. Potentially, we can use raw react (vite) and still allow for serverless apis with the api folder on vercel. Another approach could be to somehow build the HTML/JS from an environment where codesharing is allowed.

# Showing results from localStorage

The results are now shown by copying the result from the database onto localStorage. This is done since there is a nice listener for `localStorage` that can be used to see updates to the data instantly.

**BIG Limitation**: we're now limited to the max size of what can be stored into localStorage which is [10mb](https://www.google.com/search?q=localstorage+size+limit)

An alternative could be to somehow listen to IDB or check for changes every 100ms or so.

Another alternative would be to store the final JSON in a file. There's a proposed `FileSystemObserver` that may already be available: see https://github.com/WICG/file-system-access/issues/72

There might also be ready-made solutions available for syncing a redis database into the browser? https://redis.io/docs/latest/develop/use/client-side-caching/

We want the data to be shown asap, it needs to be reliable, but we also don't want to query too often.

# Building up JSON from multiple key/value items

In `indexedDbBuildObject` we are building the JSON from all key/value items in the entire storage.

We are also splitting a JSON object into an array of key/values before we store it.

This behavior results in very large amount of keys and a lot of processing. I expect this to be a big bottleneck in performance, and there may be other ideas possible on how to store things in a more efficient way.

For example, we may want to explicitly tell the JSON-Schema when something is the root of a key rather than being part of another key. Doing it like this and optimising max-keysize to be as close to 1mb as possible, would probably make the most sense.

# State is complex

We use a weird combination of react state, `localStorage`, file system, `idb` and remote `redis` because we want to do as much as possible with the browser and we have multiple environments and configurations.

It's not documented yet in a central place what is stored where, but this could be a starting point.

# IDB Buggyness

We currently have some buggyness in the IDB as sometimes the IDB store cannot be found even though we did create it before. This already requires some hacky code and still may result in a crashing website in some cases unrecoverable.

# FileSystem Buggyness

We're relying on chrome's [`FileSystem` API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API). This isn't supported by any other browser and also I've observed it to be buggy in some cases, crashing the browser. It's likely the result of a permission that wasn't given, hence ending up in a sad state that isn't handled well by chrome.

I'm still to find out the exact way to reproduce this, as it's not easy to log: the problem crashes the browser.

# Upstash limitations

Some obvious limitations of upstash can be observed in the pricing: https://upstash.com/pricing

Here's a breakdown of the more pressing limitations that limit the scope of potential applications of the current implementation of ActionSchema.

## Max request size

Upstash redis querys can be 1MB max.

See: https://upstash.com/docs/redis/troubleshooting/max_request_size_exceeded

This might lead to problems if:

- we are doing an mget with too many keys
- We want to set with >1mb.

Especially the latter is obviously possible, and this can be solved by chunking the string and using something like https://upstash.com/docs/oss/sdks/py/redis/commands/string/append over multiple requests.

## Max record size

The max record size is 100MB:

https://upstash.com/docs/redis/troubleshooting/max_record_size_exceeded

This will only lead to problems after append is implemented and we still have records that are huge. I don't think this will be a problem for 99% of usecases as long as we split JSON nicely.

## Database size

The database size can be maximum 10GB (and for enterprise can go up to 100GB). See https://upstash.com/docs/redis/troubleshooting/db_capacity_quota_exceeded. Theoretical limits of redis-like kv stores are much higher, but this limitations should not be a huge concern immediately.
