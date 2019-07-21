import { all, any, hasType, isExact, isPositive, Predicate, Template } from "./predicate";
import { err, isErr, isOk, ok, Result } from "./types/Result";
import { Token, TokenStream, TokenType } from "./types/Token";

// Types -----------------------------------------------------------------------
export type MatchResult =
  [ TokenStream, Template ]

export type MatchError =
  string

const NO_MATCHES = "I couldn't find any commands that matched this sequence";
const UNRECGONISED_INTIAL_TOKEN = "The first token in this sequence is not a " +
  "command I recognise.";
const TOKEN_TYPE_ERROR = (command: string, pos: number, expected: string, got: string) =>
  "While parsing " + command + " I expected a " + expected + " but got a " +
  got + " at position: " + pos + ".";
const MISSING_ARGUMENT = (command: string, expected: string) =>
  "While parsing " + command + " I expected a " + expected + " but I ran out " +
  "of input.";
const TOO_MANY_ARGUMENTS = (command: string, got: string) =>
  "While parsing " + command + " I received an extra " + got + ".";

// This type alias just helps to slim down some of the function signatures
// below.
type R = Result<MatchError, MatchResult>

// GameCommand templates -------------------------------------------------------
const gameCommandTemplates: Template[] = [
  [ isExact("help") ],
  [ isExact("help"), any([hasType(TokenType.GameCommand), hasType(TokenType.PlayerCommand)]) ],
];

// PlayerCommand templates -----------------------------------------------------
const playerCommandTemplates: Template[] = [
  [ any([isExact("walk"), isExact("move")]), hasType(TokenType.Direction) ],
  [ any([isExact("walk"), isExact("move")]), isPositive, hasType(TokenType.Direction) ],
];

// Matching templates ----------------------------------------------------------
const matchTemplate = (tokenStream: TokenStream, template: Template): R => {
  const [ initialToken ] = tokenStream;
  const [ initialPredicate ] = template;

  if (!initialPredicate(initialToken)) {
    return err(NO_MATCHES);
  } else if (tokenStream.length === 1 && template.length === 1) {
    return ok([ tokenStream, template ]);
  } else {
    // We're using a for loop rather than some nicer looping construct because
    // we have two additional requirements: (1) we need to grab the current
    // predicate from the template too, and (2) we need to be able to break
    // early if we run into an error.
    for (let i = 1; i < tokenStream.length || i < template.length; i++) {
      const token = tokenStream[i];
      const predicate = template[i];

      const result = predicate(token);

      if (isErr(result)) return result;
    }

    return ok([ tokenStream, template ]);
  }
};

export const match = (tokenStream: TokenStream): R => {
  // Grab the first token to check if it is actually a game or player command.
  // This is mostly necessary so we don't waste time matching against the
  // commands of different types. It also serves as an additional check if an
  // invalid token managed to sneak past the first check.
  const [ firstToken ] = tokenStream;

  // The curly braces around each case here might seem unecessary, but because
  // of javascript's scoping rules I wouldn't be able to define "match" twice.
  // I think we can agree that this is nicer than defining match *before* the
  // switch with `let`.
  switch (firstToken.type) {
    case TokenType.GameCommand: {
      let match: R = err(NO_MATCHES);

      for (let i = 0; i < gameCommandTemplates.length; i++) {
        const template = gameCommandTemplates[i];
        match = matchTemplate(tokenStream, template);

        if (isOk(match)) break;
      }

      return match;
    }

    case TokenType.PlayerCommand: {
      let match: R = err(NO_MATCHES);

      for (let i = 0; i < playerCommandTemplates.length; i++) {
        const template = playerCommandTemplates[i];
        match = matchTemplate(tokenStream, template);

        if (isOk(match)) break;
      }

      return match;
    }

    default:
      return err(UNRECGONISED_INTIAL_TOKEN);
  }
};
