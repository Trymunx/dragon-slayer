import { Creature } from "../entities/creatures";
import { Map } from "rot-js";
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
  const map = new Map.Uniform(width, height, {
    roomDugPercentage: 0.7,
    roomHeight: ROOM_SIZE_BOUNDS,
    roomWidth: ROOM_SIZE_BOUNDS,
  });
  const walls: number[][] = [];
  map.create((x, y, val) => {
    if (walls[x] === undefined) {
      walls[x] = [];
    }
    walls[x][y] = val;
  });
  const rooms = map.getRooms();
  return { rooms, walls };
};

export const generateRandomDungeon = (pos: Vector): Dungeon => {
  const rngHeight = RNG(...DUNGEON_SIZE_BOUNDS);
  const rngWidth = RNG(...DUNGEON_SIZE_BOUNDS);

  const { walls, rooms } = generateDungeon(rngWidth, rngHeight);
  // Have to cast this because getCenter returns number array
  const playerPos = rooms[0].getCenter() as [number, number];

  return {
    creatures: {},
    playerPos,
    walls,
    worldEntrancePos: pos,
  };
};
