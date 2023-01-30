import { objectEntries, objectFromEntries } from "tsafe";
import type { JsonPrimitive, JsonValue } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import parseJson from ".";

const jsonString = `{
  "foo": "bar",
  "baz": {
    "qux": "quux"
  }
}`;

const json5String = `{
  // comments
  foo: "bar",
  baz: {
    // nested comments
    qux: "quux",
  }
}`;

type OneDepthJson = Record<string, JsonPrimitive>;

function oneDepthJsonParser(jsonString: string): OneDepthJson {
  const json = JSON.parse(jsonString);
  if (json instanceof Object) {
    return objectFromEntries(
      objectEntries(json).flatMap(([key, value]) => {
        if (value instanceof Object) {
          return [];
        } else {
          return [[key, value]];
        }
      })
    );
  }
  return json;
}

const fallbackSymbol = Symbol("fallback");

describe("No default options", () => {
  test("no options", () => {
    expectTypeOf(parseJson(jsonString)).toEqualTypeOf<JsonValue>();
  });
  test("with fallback", () => {
    expectTypeOf(
      parseJson(jsonString, {
        fallback: "fallback",
      })
    ).toEqualTypeOf<JsonValue>();
    expectTypeOf(
      parseJson(jsonString, {
        fallback: undefined,
      })
    ).toEqualTypeOf<JsonValue | undefined>();
  });
  test("create a parser with a default fallback", () => {
    const parseJsonWithFallback = parseJson.create({
      fallback: fallbackSymbol,
    });
    expectTypeOf(parseJsonWithFallback(jsonString)).toEqualTypeOf<
      JsonValue | symbol
    >();
    expectTypeOf(
      parseJsonWithFallback(json5String, {
        fallback: undefined,
      })
    ).toEqualTypeOf<JsonValue | undefined>();
  });
  test("create a parser with a default parser", () => {
    const extendedOneDepthJsonParser = parseJson.create({
      parser: oneDepthJsonParser,
    });
    expectTypeOf(
      extendedOneDepthJsonParser(jsonString)
    ).toEqualTypeOf<OneDepthJson>();
    expectTypeOf(
      extendedOneDepthJsonParser(json5String, {
        fallback: undefined,
      })
    ).toEqualTypeOf<OneDepthJson | undefined>();
    expectTypeOf(
      extendedOneDepthJsonParser(json5String, {
        parser: String,
        fallback: undefined,
      })
    ).toEqualTypeOf<string | undefined>();
  });
});
