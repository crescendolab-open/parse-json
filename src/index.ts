import type { JsonValue } from "type-fest";

export type Options<Fallback, ParsedResult extends JsonValue = JsonValue> = {
  fallback: Fallback;
  parser: (input: string) => ParsedResult;
};

export interface CreateParser {
  // No default options
  (): {
    // No options
    (input: string): JsonValue;
    // With fallback only
    <Fallback>(input: string, options: Pick<Options<Fallback>, "fallback">):
      | Fallback
      | JsonValue;
    // With parser only
    <ParsedResult extends JsonValue>(
      input: string,
      options: Pick<Options<never, ParsedResult>, "parser">
    ): ParsedResult;
    // With fallback and parser
    <Fallback, ParsedResult extends JsonValue>(
      input: string,
      options: Options<Fallback, ParsedResult>
    ): Fallback | ParsedResult;
  };
  // With default fallback only
  <DefaultFallback>(options: Pick<Options<DefaultFallback>, "fallback">): {
    // No options
    (input: string): JsonValue | DefaultFallback;
    // With fallback only
    <Fallback>(input: string, options: Pick<Options<Fallback>, "fallback">):
      | Fallback
      | JsonValue;
    // With parser only
    <ParsedResult extends JsonValue>(
      input: string,
      options: Pick<Options<never, ParsedResult>, "parser">
    ): ParsedResult | DefaultFallback;
    // With fallback and parser
    <Fallback, ParsedResult extends JsonValue>(
      input: string,
      options: Options<Fallback, ParsedResult>
    ): Fallback | ParsedResult;
  };
  // With default parser only
  <DefaultParsedResult extends JsonValue>(
    options: Pick<Options<never, DefaultParsedResult>, "parser">
  ): {
    // No options
    (input: string): DefaultParsedResult;
    // With fallback only
    <Fallback>(input: string, options: Pick<Options<Fallback>, "fallback">):
      | Fallback
      | DefaultParsedResult;
    // With parser only
    <ParsedResult extends JsonValue>(
      input: string,
      options: Pick<Options<never, ParsedResult>, "parser">
    ): ParsedResult;
    // With fallback and parser
    <Fallback, ParsedResult extends JsonValue>(
      input: string,
      options: Options<Fallback, ParsedResult>
    ): Fallback | ParsedResult;
  };
  // With default fallback and parser
  <DefaultFallback, DefaultParsedResult extends JsonValue>(
    options: Options<DefaultFallback, DefaultParsedResult>
  ): {
    // No options
    (input: string): DefaultParsedResult | DefaultFallback;
    // With fallback only
    <Fallback>(input: string, options: Pick<Options<Fallback>, "fallback">):
      | Fallback
      | DefaultParsedResult;
    // With parser only
    <ParsedResult extends JsonValue>(
      input: string,
      options: Pick<Options<never, ParsedResult>, "parser">
    ): ParsedResult | DefaultFallback;
    // With fallback and parser
    <Fallback, ParsedResult extends JsonValue>(
      input: string,
      options: Options<Fallback, ParsedResult>
    ): Fallback | ParsedResult;
  };
}

const create: CreateParser = function createParser<DefaultFallback>(
  defaultOptions?: Options<DefaultFallback>
) {
  return function parseJson<Fallback>(
    input: string,
    options?: Options<Fallback>
  ) {
    const parse = options?.parser ?? defaultOptions?.parser ?? JSON.parse;
    const noError =
      (options && "fallback" in options) ||
      (defaultOptions && "fallback" in defaultOptions);
    const fallback =
      options && "fallback" in options
        ? options.fallback
        : defaultOptions?.fallback;
    try {
      return parse(input) as JsonValue;
    } catch (error) {
      if (!noError) throw error;
      return fallback as Fallback;
    }
  };
} as CreateParser;

const defaultParser = create();
export const parseJson = Object.assign(defaultParser, { create });
