import { dispatchAction } from "../../vuex/actions";
import { generateTiles } from "./tiles";
import { Item } from "../../types";
import { Player } from "../entities/player";
import { RNG } from "../utils/RNG";
import store from "../../vuex/store";
import { AllCreatures, Creature } from "../entities/creatures";
import { getRandomPosInChunk, Vector, VTS } from "./position";

export type GenericTile = {
  display: string;
  foreground: string;
}
export type Tile = {
  gold: number;
  items: Item[];
  tileTemplate: GenericTile;
}
type Chunk = {
  pos: Vector;
  tiles: Array<Tile[]>;
}
export type World = {
  chunks: {
    [origin: string]: Chunk;
  };
  size: number;
}

// TODO: Generation is faster with a smaller chunk size.
const CHUNK_SIZE = 24;
export function generateWorld(): World {
  const world: World = {
    chunks: {},
    size: 0,
  };
  const chunk = generateChunk(world, 0, 0);
  world.chunks[VTS(0, 0)] = chunk;
  world.size++;

  return world;
};

function generateChunk(world: World, x: number, y: number): Chunk {
  if (hasChunk(world, x, y)) {
    console.warn(`Chunk already exists at x: ${x}, y: ${y}`);
    return world.chunks[VTS(x, y)];
  }
  const chunk: Chunk = {
    pos: [x, y],
    tiles: generateTiles(CHUNK_SIZE, [x, y]),
  };

  genCreatures(CHUNK_SIZE, x, y, store.getters.playerLevel);
  return chunk;
};

const hasChunk = (world: World, x: number, y: number): boolean =>
  world.chunks[VTS(x, y)] !== undefined;

export function getTile(world: World, x: number, y: number) {
  const chunkCoords: Vector = [Math.floor(x / CHUNK_SIZE), Math.floor(y / CHUNK_SIZE)];
  if (!hasChunk(world, ...chunkCoords)) {
    world.chunks[VTS(...chunkCoords)] = generateChunk(world, ...chunkCoords);
  }
  const [xOffset, yOffset] = chunkCoords.map(coord => coord * CHUNK_SIZE);
  return {
    tile: world.chunks[VTS(...chunkCoords)].tiles[x - xOffset][y - yOffset],
    world,
  };
};

// TODO: pass in chunk to get the structures in a chunk
const genCreatures = (
  chunkSize: number,
  left: number,
  top: number,
  playerLevel: number = 1
) => {
  AllCreatures.forEach(c => {
    let numberInChunk = Math.round(c.attributes.spawnChance * 0.2 * chunkSize ** 2);
    for (let i = 0; i < numberInChunk; i++) {
      let creatureLevel = Math.ceil(Math.random() * playerLevel * 1.5);
      let pos = getRandomPosInChunk(chunkSize, left, top);
      let creature = new Creature({
        level: creatureLevel,
        pos: pos,
        template: c,
      });
      dispatchAction.AddCreature(creature);
    }
  });
};
