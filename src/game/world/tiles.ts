import * as ROT from "rot-js";
import { GenericTile, Tile } from "./World";
import { Vector, VTS } from "./position";

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
  // .concat([{
  //   display: ".",
  //   foreground: "#855e40",
  //   probability: 100,
  // }])
  .sort((a, b) => b.probability - a.probability);

// Calculate the total of all of the tile probabilities for randomising the tiles
const total = tiles.reduce((sum: number, tile): number => tile.probability + sum, 0);

const Noise = new ROT.Noise.Simplex(2431);

const divisor = 32;

function getRandomTileTemplate(x: number, y: number): GenericTile {
  const noiseValue = Noise.get(x / divisor / 2, y / divisor);
  if (noiseValue > 0) {
    return {
      display: ".",
      foreground: "#855e40",
    };
  }
  const rand = Math.floor(Math.random() * total);
  return tiles.find(tile => tile.probability < rand) || tiles[0];
}

export function generateTiles(chunkSize: number, offset: Vector): Array<Tile[]> {
  const tiles: Array<Tile[]> = [];
  for (let x = 0; x < chunkSize; x++) {
    tiles[x] = [];
    for (let y = 0; y < chunkSize; y++) {
      tiles[x][y] = {
        gold: 0,
        items: [],
        tileTemplate: getRandomTileTemplate(x + offset[0] * chunkSize, y + offset[1] * chunkSize),
      };
    }
  }
  return tiles;
};
