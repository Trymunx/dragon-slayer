export interface Token { 
  readonly type: TokenType, 
  value: string | number 
}

export type TokenStream 
  = Token[]

export enum TokenType {
  // Generic Tokens
  GameCommand,
  PlayerCommand,
  Conjunction,
  Number,
  Word,
  // Contextual Tokens
  Creature,
  Item,
  Direction,
  // Error Token
  Error
}

// Token checkers --------------------------------------------------------------
export const isGameCommand = (token: string): boolean => {
  switch (token) {
    case '/help':
      return true
    default:
      return false
  }
}

export const isPlayerCommand = (token: string): boolean => {
  switch (token) {
    case 'move':
    case 'walk':
    case 'drop':
      return true
    default:
      return false
  }
}

export const isConjunction = (token: string): boolean => {
  switch (token) {
    case 'and':
    case 'then':
      return true
    default:
      return false
  }
}

export const isNumber = (token: string): boolean => {
  return !isNaN(parseInt(token))
}
