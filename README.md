# @crescendolab/parse-json

A user-friendly wrapper for `JSON.parse()`.

```ts
// ✅ Returns type `JsonValue` which is stricter than `unknown`.
// ✅ Fallback specified value is returned if `input` is not a valid JSON string.
const output = parseJson(input, null);
//    ^? const output: JsonValue
if (typeof output === "function") {
  output;
  // ^? const output: never
}
if (output === undefined) {
  output;
  // ^? const output: never
}

// ❌ Return with type `any`.
// ❌ Might throw an error if `input` is not a valid JSON string.
const vanillaOutput = JSON.parse(input);
//    ^? const vanillaOutput: any
```

## Installation

```sh
pnpm i @crescendolab/parse-json
```

## Usage

```ts
import { parseJson } from "@crescendolab/parse-json";

const input = await loadJson();
const output = parseJson(input);
```

## Options

```ts
parseJson(input, options);
```

### `options.fallback`

- Type: `any`

Specify a fallback value to be returned if it fails to parse `input` as a JSON string.

```ts
const input = "not a valid json string";

// ✅ Get `undefined` instead of throwing an error.
const output = parseJson(input, { fallback: undefined });
```

### `options.parser`

- Type: `(input: string) => JsonValue`

Specify a custom parser function.

For example, you can use [`json5`](https://github.com/json5/json5) for comments in json or [parse-json](https://github.com/sindresorhus/parse-json) for helpful error messages.

```ts
import { parseJson } from "@crescendolab/parse-json";
import json5 from "json5";

const input = `{
  // This is a comment
  "foo": "bar"
}`;

// ✅ This will not throw an error.
const output = parseJson(input, {
  parser: json5.parse,
});
```

## Create your own parser

You can create a parser with a custom default options where the options are the same as the `options` argument of `parseJson()`.

```ts
import { parseJson } from "@crescendolab/parse-json";

const myParser = parseJson.create(options);
const myParser = parseJson.create({ fallback: undefined });
```

## License

MIT © [Crescendo lab](https://www.cresclab.com/)
