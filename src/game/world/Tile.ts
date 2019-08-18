import Chunk from "./Chunk";
import { Creature } from "../entities/creatures";
import genTree from "./genTree";
import { Item } from "../../types";
import { Vector } from "./position";

type Terrain = "forest" | "mountain" | "hills" | "river";

export default class Tile {
  chunk: Chunk;
  display: string;
  foreground: string;
  gold: number;
  items: Item[];
  relPos: Vector;
  spawnRateModifiers: Map<Creature, number>;

  constructor(x: number, y: number, chunk: Chunk, terrain?: Terrain) {
    this.chunk = chunk;
    this.gold = 0;
    this.items = [];
    this.relPos = [x, y];

    switch (terrain) {
      case "forest":
        this.display = genTree();
        this.foreground = "#086623";
        break;
      default:
        this.display = "·";
        this.foreground = "#855e40";
        break;
    }
    this.spawnRateModifiers = new Map();
  }

  setSpawnRateMod(creature: Creature, spawnrate: number) {
    this.spawnRateModifiers.set(creature, spawnrate);
  }

  getSpawnRateMod(creature: Creature) {
    return this.spawnRateModifiers.has(creature) ? this.spawnRateModifiers.get(creature) : 1;
  }
}
