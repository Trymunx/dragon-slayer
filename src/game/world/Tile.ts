import Chunk from "./Chunk";
import Creature from "../entities/creatures";
import genTree from "./genTree";
import { Item } from "../../types";
import Position from "./position";

type Terrain = "forest" | "mountain" | "hills" | "river";

export default class Tile {
  chunk: Chunk;
  display: string;
  foreground: string;
  items: Item[];
  relPos: Position;
  spawnRateModifiers: Map<Creature, number>;

  constructor(x: number, y: number, chunk: Chunk, terrain?: Terrain) {
    this.chunk = chunk;
    this.items = [];
    this.relPos = new Position(x, y);

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
