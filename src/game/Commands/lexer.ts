import { Token, TokenStream, TokenType, isGameCommand, isPlayerCommand, isConjunction, isNumber} from './Token'
import { Result, ok, err } from './Result'
import { matchTest } from './templates'

// Dictionary ------------------------------------------------------------------
// Use these types / enums / things as a dictionary for all the game's terms.
// Something like two consecutive tokens:
//   [ { type: TokenType.Word, value: "leather" }
//   , { type: TokenType.Word, value: "hide" }
//   ]
// can be converted into a single *item* token with the value "leather hide".
import creatures from '../entities/CreaturesTemplates.json'
import gameItems from '../items/gameItems'

// Keen readers will notice that a Dictionary actually is the same type alias as
// as a TokenStream. Their use is very different, however, and so the types
// remain separate to make clear their intended use.
type Dictionary =
  Token[]

let dictionary: Dictionary = [
  { type: TokenType.Direction, value: "north" },
  { type: TokenType.Direction, value: "south" },
  { type: TokenType.Direction, value: "west" },
  { type: TokenType.Direction, value: "east" }
]

// Populate the dictionary with all the create names in the game. We use
// Object.values instead of a tradtional for..in to appease typescript...
Object.values(creatures).forEach(({ name }) => {
  dictionary.push({ type: TokenType.Creature, value: name, })
})

// We need both the singular and plural names for all the items in the game,
// the player might want to drop two *swords* or just one *sword*.
gameItems.forEach(({ name, plural }) => {
  dictionary.push({ type: TokenType.Item, value: name })
  dictionary.push({ type: TokenType.Item, value: plural })
})

// Tokenise --------------------------------------------------------------------
const tokenise = (input: string[]): TokenStream => {
  return input.map(token => {
    if (isGameCommand(token)) {
      return { type: TokenType.GameCommand, value: token }
    } else if (isPlayerCommand(token)) {
      return { type: TokenType.PlayerCommand, value: token }
    } else if (isConjunction(token)) {
      return { type: TokenType.Conjunction, value: token }
    } else if (isNumber(token)) {
      return { type: TokenType.Number, value: parseInt(token) }
    } else {
      return { type: TokenType.Word, value: token }
    }
  })  
}

const contextualise = (tokenStream: TokenStream): TokenStream => {
  let contextualisedTokenStream = []

  for (let i = 0; i < tokenStream.length; i++) {
    const token = tokenStream[i]
    const nextToken: Token | undefined = tokenStream[i + 1]

    // Return the token unchanged if it's not a Word. We're only interested in
    // transforming Word tokens to more descriptive tokens like Item and 
    // Creature.
    if (token.type !== TokenType.Word) {
      contextualisedTokenStream.push(token)
      continue
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
        const combinedWord = token.value + " " + nextToken.value
        const contextualisedToken: Token | undefined = dictionary.find(item => {
          return item.value === combinedWord
        })

        if (contextualisedToken !== undefined) {
          contextualisedTokenStream.push(contextualisedToken)
          i++
          continue
        }
      }

      // The greedy replacement didn't work, try the same thing again but just
      // with the singular token.
      const contextualisedToken: Token | undefined = dictionary.find(item => {
        return item.value === token.value
      })

      if (contextualisedToken !== undefined) {
        contextualisedTokenStream.push(contextualisedToken)
        continue
      } else {
        contextualisedTokenStream.push({ ...token, type: TokenType.Error })
      }
    }
  }

  return contextualisedTokenStream
}

export const run = (input: string): Result<string, TokenStream> => {
  const tokens = tokenise(input.split(" "))
  const firstToken: Token = tokens[0]

  // We can save some computation and end the lexer earlier if the first token
  // wasn't a command of some type.
  if (firstToken.type !== TokenType.GameCommand && firstToken.type !== TokenType.PlayerCommand) {
    return err("Messages must start with a command.")
  }

  // If the first token was a command, we can assume that on a most basic level
  // there is some validity to the TokenStream. Now we're going to go in and 
  // turn all those Word tokens into something a lot more specific. This will
  // allow the template matching to do it's thing.
  const contextualisedTokens = contextualise(tokens)
  const isValid = matchTest(contextualisedTokens)

  return isValid
    ? ok(contextualisedTokens)
    : err("Something went wrong")
}