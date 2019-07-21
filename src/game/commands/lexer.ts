import { dictionary } from "./dictionary";
import { match, MatchError, MatchResult } from "./templates";
import { err, isOk, map, mapErr, ok, Result } from "./types/Result";
import {
  isConjunction,
  isGameCommand,
  isNumber,
  isPlayerCommand,
  Token,
  TokenStream,
  TokenType,
} from "./types/Token";

// Tokenise --------------------------------------------------------------------
const tokenise = (input: string[]): TokenStream => {
  return input.map(token => {
    if (isGameCommand(token)) {
      return { type: TokenType.GameCommand, value: token };
    } else if (isPlayerCommand(token)) {
      return { type: TokenType.PlayerCommand, value: token };
    } else if (isConjunction(token)) {
      return { type: TokenType.Conjunction, value: token };
    } else if (isNumber(token)) {
      return { type: TokenType.Number, value: parseInt(token) };
    } else {
      return { type: TokenType.Word, value: token };
    }
  });
};

const contextualise = (tokenStream: TokenStream): TokenStream => {
  let contextualisedTokenStream = [];

  for (let i = 0; i < tokenStream.length; i++) {
    const token = tokenStream[i];
    const nextToken: Token | undefined = tokenStream[i + 1];

    // Return the token unchanged if it's not a Word. We're only interested in
    // transforming Word tokens to more descriptive tokens like Item and
    // Creature.
    if (token.type !== TokenType.Word) {
      contextualisedTokenStream.push(token);
      continue;
    } else {
      // This is a greedy replacement, we'll always lookahead *first* to try and
      // consume two tokens to match a word in the dicionary rather than one.
      // This means if we have the following two tokens:
      //   [ { type: TokenType.Word, value: "dragon" }
      //   , { type: TokenType.Word, value: "claw" }
      //   ]
      // We will always get a single "dragon claw" Item token, and *not* two
      // tokens: A "dragon" Creature token and a "claw" Item token.
      if (nextToken !== undefined && nextToken.type === TokenType.Word) {
        const combinedWord = token.value + " " + nextToken.value;
        const contextualisedToken: Token | undefined = dictionary.find(item => {
          return item.value === combinedWord;
        });

        if (contextualisedToken !== undefined) {
          contextualisedTokenStream.push(contextualisedToken);
          i++;
          continue;
        }
      }

      // The greedy replacement didn't work, try the same thing again but just
      // with the singular token.
      const contextualisedToken: Token | undefined = dictionary.find(item => {
        return item.value === token.value;
      });

      if (contextualisedToken !== undefined) {
        contextualisedTokenStream.push(contextualisedToken);
        continue;
      } else {
        contextualisedTokenStream.push({ ...token, type: TokenType.Error });
      }
    }
  }

  return contextualisedTokenStream;
};

export const run = (input: string): Result<string, MatchResult> => {
  const tokens = tokenise(input.split(" "));
  const firstToken: Token = tokens[0];

  // We can save some computation and end the lexer earlier if the first token
  // wasn't a command of some type.
  if (firstToken.type !== TokenType.GameCommand && firstToken.type !== TokenType.PlayerCommand) {
    return err("Messages must start with a command.");
  }

  // If the first token was a command, we can assume that on a most basic level
  // there is some validity to the TokenStream. Now we're going to go in and
  // turn all those Word tokens into something a lot more specific. This will
  // allow the template matching to do it's thing.
  const contextualisedTokens = contextualise(tokens);
  const matchingTemplate = match(contextualisedTokens);

  console.log(matchingTemplate);

  if (isOk(matchingTemplate)) {
    return matchingTemplate;
  } else {
    // This might seem redundant, the error stored in this Result has the type
    // MatchError. The return type of this function, however, is a plain string.
    // This is because we can error out before now. This identity map is telling
    // typescript to treat the error as a vanilla js string.
    return mapErr(matchingTemplate, templateError => templateError as string);
  }
};
