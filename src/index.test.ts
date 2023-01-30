import json5 from "json5";
import parseJsonWithHelpfulErrors from "parse-json";
import { describe, expect, test } from "vitest";
import parseJson from ".";

const jsonString = `{
  "foo": "bar",
  "baz": {
    "qux": "quux"
  }
}`;

const jsonResult = JSON.parse(jsonString);

const json5String = `{
  // comments
  foo: "bar",
  baz: {
    // nested comments
    qux: "quux",
  }
}`;

const json5Result = json5.parse(json5String);

const fallbackSymbol = Symbol("fallback");

const parseJson5HelpfulErrorMessage = `Unexpected token "/" (0x2F) in JSON at position 4 while parsing near "{\\n  // comments\\n  foo: \\"..." 

  1 | {
> 2 |   // comments
    |   ^
  3 |   foo: "bar",
  4 |   baz: {
  5 |     // nested comments
`;

describe("No default options", () => {
  test("no options", () => {
    expect(parseJson(jsonString)).toStrictEqual(jsonResult);
    expect(() => parseJson(json5String)).toThrowError();
  });
  test("with fallback", () => {
    expect(parseJson(json5String, { fallback: "fallback" })).toBe("fallback");
    expect(parseJson(json5String, { fallback: undefined })).toBe(undefined);
  });
  test("with parser", () => {
    expect(parseJson(json5String, { parser: json5.parse })).toStrictEqual(
      json5Result
    );
    expect(
      (() => {
        try {
          parseJson(json5String, { parser: parseJsonWithHelpfulErrors });
          throw new Error("Expected an error");
        } catch (e) {
          if (!(e instanceof Error)) throw e;
          return e;
        }
      })().message
    ).toBe(parseJson5HelpfulErrorMessage);
  });
  test('create with "fallback" option', () => {
    const newParser = parseJson.create({ fallback: fallbackSymbol });
    expect(newParser(json5String)).toBe(fallbackSymbol);
    expect(
      newParser(json5String, {
        fallback: undefined,
      })
    ).toStrictEqual(undefined);
  });
  test('create with "parser" option', () => {
    const newParser = parseJson.create({ parser: json5.parse });
    expect(newParser(json5String)).toStrictEqual(json5Result);
    expect(
      (() => {
        try {
          newParser(json5String, { parser: parseJsonWithHelpfulErrors });
          throw new Error("Expected an error");
        } catch (e) {
          if (!(e instanceof Error)) throw e;
          return e;
        }
      })().message
    ).toBe(parseJson5HelpfulErrorMessage);
  });
});
