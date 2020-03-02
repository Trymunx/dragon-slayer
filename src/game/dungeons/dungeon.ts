import * as ROT from "rot-js";
import { Creature } from "../entities/creatures";
import { RNG } from "../utils/RNG";
import { Vector } from "../world/position";

const DUNGEON_SIZE_BOUNDS = [40, 100];
const ROOM_SIZE_BOUNDS: [number, number] = [3, 20];

export interface Dungeon {
    creatures: { [location: string]: Creature[]; };
    playerPos: Vector;
    walls: number[][];
    worldEntrancePos: Vector;
}

export const generateDungeon = (width: number, height: number) => {
  const map = new ROT.Map.Uniform(width, height, {
    roomDugPercentage: 0.7,
    roomHeight: ROOM_SIZE_BOUNDS,
    roomWidth: ROOM_SIZE_BOUNDS,
  });
  const dungeon: number[][] = [];
  map.create((x, y, val) => {
    if (dungeon[x] === undefined) {
      dungeon[x] = [];
    }
    dungeon[x][y] = val;
  });
  return dungeon;
};

export const generateRandomDungeon = (pos: Vector): Dungeon => {
  const rngHeight = RNG(...DUNGEON_SIZE_BOUNDS);
  const rngWidth = RNG(...DUNGEON_SIZE_BOUNDS);

  const walls = generateDungeon(rngWidth, rngHeight);

  return {
    creatures: {},
    playerPos: [0, 0],
    walls,
    worldEntrancePos: pos,
  };
};
