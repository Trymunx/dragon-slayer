// Use these types / enums / things as a dictionary for all the game's terms.
// Something like two consecutive tokens:
//   [ { type: TokenType.Word, value: "leather" }
//   , { type: TokenType.Word, value: "hide" }
//   ]
// can be converted into a single *item* token with the value "leather hide".
import creatures from "../entities/CreaturesTemplates.json";
import gameItems from "../items/gameItems";

import { Token, TokenType } from "./types/Token";

// Dictionary ------------------------------------------------------------------
// Keen readers will notice that a Dictionary actually is the same type alias as
// as a TokenStream. Their use is very different, however, and so the types
// remain separate to make clear their intended use.
type Dictionary =
  Token[]

// We're going to add items to the dictionary after this export, but we export
// it here to save some clunky reassigning just to export with the "dictionary"
// name.
export const dictionary: Dictionary = [
  { type: TokenType.Direction, value: "north" },
  { type: TokenType.Direction, value: "south" },
  { type: TokenType.Direction, value: "west" },
  { type: TokenType.Direction, value: "east" },
];

// Populate the dictionary with all the create names in the game. We use
// Object.values instead of a tradtional for..in to appease typescript...
Object.values(creatures).forEach(({ name }) => {
  dictionary.push({ type: TokenType.Creature, value: name });
});

// We need both the singular and plural names for all the items in the game,
// the player might want to drop two *swords* or just one *sword*.
gameItems.forEach(({ name, plural }) => {
  dictionary.push({ type: TokenType.Item, value: name });
  dictionary.push({ type: TokenType.Item, value: plural });
});
