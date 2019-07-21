// Types -----------------------------------------------------------------------
// When parsing, we receive an array of strings that is the user-entered message
// split on whitespace. What we want, then, is to encode some meaning alongside
// each of those strings and that is what a Token does. By assigning each Token
// a TokenType we can then perform some more involved checks to make sure a 
// message is a valid command.
export interface Token { 
  readonly type: TokenType, 
  value: string | number 
}

// A simple type alias for an array of Tokens, but it contains a bit more 
// meaning.
export type TokenStream 
  = Token[]

// Tokens can be one of a number of types. They start off as generic token types
// such as Number or Word. Then all the Word tokens are refined into the more
// contextual TokenTypes like Creature and Direction; this means by the time
// a TokenStream is passed to the template parsing engine, it should be trivial
// to match a stream to a valid template.
export enum TokenType {
  // Generic Tokens
  GameCommand = "GameCommandToken",
  PlayerCommand = "PlayerCommandToken",
  Conjunction = "ConjunctionToken",
  Number = "NumberToken",
  Word = "WordToken",
  // Contextual Tokens
  Creature = "CreatureToken",
  Item = "ItemToken",
  Direction = "DirectionToken",
  // Error Token 
  Error = "ErrorToken"
}

// Input checkers --------------------------------------------------------------
// These should all be largely self explanatory, and don't need individual
// documentation. Notice, however, that there is no `isWord`. At the stage in
// the process when these functions are useful, it makes sense to assume that
// any input string that doesn't satisfy one of these chucks *must* be a simple
// Word token.
// Note: These commands aren't for checking the type of existing *Tokens*, but
// rather incoming "raw" strings.
export const isGameCommand = (input: string): boolean => {
  switch (input) {
    case '/help':
      return true
    default:
      return false
  }
}

export const isPlayerCommand = (input: string): boolean => {
  switch (input) {
    case 'move':
    case 'walk':
    case 'drop':
      return true
    default:
      return false
  }
}

export const isConjunction = (input: string): boolean => {
  switch (input) {
    case 'and':
    case 'then':
      return true
    default:
      return false
  }
}

export const isNumber = (input: string): boolean => {
  return !isNaN(parseInt(input))
}
