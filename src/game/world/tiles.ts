import { VTS } from "./position";
import { GenericTile, Tile } from "./World";

const trees = [
  {
    display: "↟",
    prob: 44,
  },
  {
    display: "⇞",
    prob: 26,
  },
  {
    display: "↑",
    prob: 20,
  },
  {
    display: "⇈",
    prob: 7,
  },
  {
    display: "⭫",
    prob: 6,
  },
  {
    display: "𐇲",
    prob: 12,
  },
  {
    display: "⇡",
    prob: 5,
  },
  {
    display: "⇑",
    prob: 5,
  },
  {
    display: "⥉",
    prob: 3,
  },
  {
    display: "⭎",
    prob: 3,
  },
  {
    display: "⤒",
    prob: 3,
  },
  {
    display: "⭜",
    prob: 2,
  },
];

// Map trees to tiles, adding in the green fg colour,
// Concat to add the blank tile with no tree, with a different fg colour,
// Sort in order of descending probability.
const tiles = trees
  .map(tree => {
    return {
      display: tree.display,
      foreground: "#086623",
      probability: tree.prob,
    };
  })
  .concat([{
    display: ".",
    foreground: "#855e40",
    probability: 100,
  }])
  .sort((a, b) => b.probability - a.probability);

// Calculate the total of all of the tile probabilities for randomising the tiles
const total = tiles.reduce((sum: number, tile): number => tile.probability + sum, 0);

function getRandomTileTemplate(): GenericTile {
  const rand = Math.floor(Math.random() * total);
  const chosenTile = tiles.find(tile => tile.probability < rand);
  return chosenTile || tiles[0];
}

export function generateTiles(chunkSize: number): Array<Tile[]> {
  const tiles: Array<Tile[]> = [];
  for (let x = 0; x < chunkSize; x++) {
    tiles[x] = [];
    for (let y = 0; y < chunkSize; y++) {
      tiles[x][y] = {
        gold: 0,
        items: [],
        tileTemplate: getRandomTileTemplate(),
      };
    }
  }
  return tiles;
};
