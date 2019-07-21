import { Token, TokenStream, TokenType } from "./types/Token";

// Types -----------------------------------------------------------------------
// We use Predicate functions to validate tokens according to some template
// below. When combined with the higher-order compositions like `all` or `any`
// we can create powerful parsing templates.
type Predicate
  = (token: Token) => boolean

// A template is a list of Predicates. Ideally, a list of tokens of tokens is
// checked against the predicate that has the corresponding index. By having
// multiple templates per command, we can easily allow for expressive
// configurations of commands.
type Template
  = Predicate[]

//

// Predicate functions ---------------------------------------------------------
const hasType = (type: TokenType): Predicate => token =>
  token.type === type;

const isExact = (keyword: string): Predicate => token =>
  token.value === keyword;

const isPositive: Predicate = token =>
  token.value > 0;

// Predicate function composition ----------------------------------------------
// Takes an array of predicates and attempts to satisfy ALL of them with the
// current token.
const all = (predicates: Predicate[]): Predicate => token =>
  predicates.reduce((allMatch: boolean, predicate: Predicate) =>
    allMatch && predicate(token), true
  );

// Takes an array of predicates and attempts to satisfy ANY of them with the
// current token.
const any = (predicates: Predicate[]): Predicate => token =>
  predicates.reduce((anyMatch: boolean, predicate: Predicate) =>
    anyMatch || predicate(token), false
  );

// Testing ---------------------------------------------------------------------
export const matchTest = (tokenStream: TokenStream): boolean => {
  const testTemplate = [
    all([ hasType(TokenType.PlayerCommand), isExact("move") ]),
    isPositive,
    hasType(TokenType.Direction),
  ];

  return testTemplate.reduce((isValid: boolean, predicate: Predicate, i: number) => {
    const token: Token | undefined = tokenStream[i];

    return token !== undefined ? isValid && predicate(token) : false;
  }, true);
};
