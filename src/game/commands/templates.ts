import { any, hasType, isExact, isPositive, Template } from "./predicate";
import { emptyToken, TokenStream, TokenType } from "./types/Token";
import { err, isErr, isOk, mapErr, ok, Result } from "./types/Result";

// Types -----------------------------------------------------------------------
export type MatchSuccess = {
  stream: TokenStream,
  template: Template
}

export type MatchFailure = {
  message: string
  type: MatchErrorType,
}

export enum MatchErrorType {
  NO_MATCHES,
  UNRECGONISED_INTIAL_TOKEN,
  TOO_MANY_ARGUMENTS,
  TOKEN_TYPE_MISMATCH
}

const noMatchesError = () => ({
  message: "I couldn't find any commands that matched this sequence.",
  type: MatchErrorType.NO_MATCHES,
});

const unrecognisedInitialTokenError = () => ({
  message: "The first token in this sequence is not a command I recognise.",
  type: MatchErrorType.UNRECGONISED_INTIAL_TOKEN,
});

const tooManyArgumentsError = (command: string, got: string) => ({
  message: `While parsing ${command} I received an extra ${got}.`,
  type: MatchErrorType.TOO_MANY_ARGUMENTS,
});

const tokenTypeMismatchError = (message: string) => ({
  message,
  type: MatchErrorType.TOKEN_TYPE_MISMATCH,
});

// This type alias just helps to slim down some of the function signatures
// below.
type R = Result<MatchFailure, MatchSuccess>

// GameCommand templates -------------------------------------------------------
const gameCommandTemplates: Template[] = [
  [isExact("/help")],
  [isExact("/help"), any([hasType(TokenType.GameCommand), hasType(TokenType.PlayerCommand)])],
];

// PlayerCommand templates -----------------------------------------------------
const playerCommandTemplates: Template[] = [
  [any([isExact("walk"), isExact("move")]), hasType(TokenType.Direction)],
  [any([isExact("walk"), isExact("move")]), isPositive, hasType(TokenType.Direction)],
  [isExact("drop"), hasType(TokenType.Item)],
  [isExact("drop"), isPositive, hasType(TokenType.Item)],
  [any([isExact("fight"), isExact("attack")]), hasType(TokenType.Creature)],
  [any([isExact("run"), isExact("flee")])],
  [isExact("examine"), any([hasType(TokenType.Item), hasType(TokenType.Creature)])],
];

// Matching templates ----------------------------------------------------------
const matchTemplate = (tokenStream: TokenStream, template: Template): R => {
  const [initialToken] = tokenStream;
  const [initialPredicate] = template;

  if (isErr(initialPredicate(initialToken))) {
    return err(noMatchesError());
  } else if (tokenStream.length === 1 && template.length === 1) {
    return ok([tokenStream, template]);
  } else {
    // We're using a for loop rather than some nicer looping construct because
    // we have two additional requirements: (1) we need to grab the current
    // predicate from the template too, and (2) we need to be able to break
    // early if we run into an error.
    for (let i = 1; i < tokenStream.length || i < template.length; i++) {
      const token = tokenStream[i];
      const predicate = template[i];

      // This if statements handles the case where our command input is longer
      // than the template so there is no predicate to run.
      if (predicate === undefined) {
        return err(tooManyArgumentsError(initialToken.value, token.type));

        // This else if handles the case where our command input was shorter than
        // the template. We can pass in a special empty token to the current
        // predicate and be confident it will Err out. This will give us a nice
        // error message telling us what token it actually expected!
      } else if (token === undefined) {
        return mapErr(predicate(emptyToken), tokenTypeMismatchError);
      }

      const result = predicate(token);

      if (isErr(result)) return mapErr(result, tokenTypeMismatchError);
    }

    return ok({
      stream: tokenStream,
      template,
    });
  }
};

export const match = (tokenStream: TokenStream): R => {
  // Grab the first token to check if it is actually a game or player command.
  // This is mostly necessary so we don't waste time matching against the
  // commands of different types. It also serves as an additional check if an
  // invalid token managed to sneak past the first check.
  const [firstToken] = tokenStream;

  if (firstToken.type !== TokenType.GameCommand && firstToken.type !== TokenType.PlayerCommand) {
    return err(unrecognisedInitialTokenError());
  }

  const templates = firstToken.type === TokenType.GameCommand
    ? gameCommandTemplates
    : playerCommandTemplates;

  const match = templates
    .map(template => matchTemplate(tokenStream, template))
    // Remove all entries where the command didn't even *begin* parsing.
    .filter(a => !(isErr(a) && a.value.type === MatchErrorType.NO_MATCHES))
    // Move all Ok results to the beginning of the array, so that when we shift
    // if there *was* an Ok result we're guaranteed to get it. We still want
    // to preserve the errors, however, which is why we don't simply filter the
    // array if isOk
    .sort((a, b) => isOk(a) && isErr(b) ? -1 : isErr(a) && isOk(b) ? 1 : 0)
    .shift();

  return match || err(noMatchesError());
};
