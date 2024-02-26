Although dotnotation is great, there is also the reference location, which is probably more inter operable.

Dot notation:

`items.*.name`

Reference notation:

`#/items/*/name`

The cool thing you probably don't get with dot notation is relative notation and refering to other schemas.

Paths can have `dot-segments` (see https://datatracker.ietf.org/doc/html/rfc3986#section-3.3) which could be a nice extra addition to use in ref. However some people already came up with an alternative too!

See;

https://opis.io/json-schema/2.x/pointers.html#relative-pointers
https://json-schema.org/draft/2020-12/relative-json-pointer
https://stackoverflow.com/questions/54467030/is-there-any-way-to-use-json-pointers-to-use-relative-path-in-side-json-string

Active work:
https://github.com/orgs/json-schema-org/discussions/225

For now I'll stay with dotnotation in case I want to refer to something **in the data**

In the future, it could be great to start with relative json pointers.
