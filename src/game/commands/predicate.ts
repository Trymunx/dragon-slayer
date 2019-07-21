import { err, isErr, isOk, ok, Result } from "./types/Result";
import { Token, TokenStream, TokenType } from "./types/Token";

// Types -----------------------------------------------------------------------
// We use Predicate functions to validate tokens according to some template
// below. When combined with the higher-order compositions like `all` or `any`
// we can create powerful parsing templates.
export type Predicate
  = (token: Token) => Result<string, null>

// A template is a list of Predicates. Ideally, a list of tokens is checked
// against the predicate that has the corresponding index. By having multiple
// templates per command, we can easily allow for expressive configurations of
// commands.
export type Template
  = Predicate[]

// Predicate functions ---------------------------------------------------------
export const hasType = (type: TokenType): Predicate => token =>
  token.type === type
    ? ok(null)
    : err(`Expected a token of type ${type} but got a ${token.type}`);

export const isExact = (keyword: string): Predicate => token =>
  token.value === keyword
    ? ok(null)
    : err(`Expected token to be exactly ${keyword} but it was ${token.value}`);

export const isPositive: Predicate = token =>
  token.type === TokenType.Number
    ? token.value > 0
      ? ok(null)
      : err(`Expected a positive number like 4 but got ${token.value}`)
    : err(`Expected a token of type NumberToken but got a ${token.type}`);

// Predicate function composition ----------------------------------------------
// Takes an array of predicates and attempts to satisfy ALL of them with the
// current token.
export const all = (predicates: Predicate[]): Predicate => token =>
  predicates.reduce((result: Result<string, null>, predicate: Predicate) => {
    const currentResult = predicate(token);

    if (isOk(currentResult) && isOk(result)) {
      return ok(null);
    } else {
      return currentResult;
    }
  }, ok(null));

// Takes an array of predicates and attempts to satisfy ANY of them with the
// current token.
export const any = (predicates: Predicate[]): Predicate => token =>
  predicates.reduce((result: Result<string, null>, predicate: Predicate) => {
    const currentResult = predicate(token);

    if (isErr(currentResult)) {
      return currentResult;
    } else if (isErr(result)) {
      return result;
    } else {
      return ok(null);
    }
  }, ok(null));
