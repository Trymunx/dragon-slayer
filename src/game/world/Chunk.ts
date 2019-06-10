// import genCreatures from "../creatures/genCreatures";
import { genCreatures } from "../entities/creatures";
import Position from "./position";
import store from "../../vuex/store";
import Tile from "./Tile";
import World from "./World";
import { Direction, parseDir } from "../utils/direction";

const CHUNK_SIZE: number = 64;

export default class Chunk {
  pos: Position;
  world: World;
  tiles: Array<Tile[]>;

  constructor(x: number, y: number, world: World) {
    this.pos = new Position(x, y);
    // this.x = x;
    // this.y = y;
    this.world = world;
    this.tiles = [];

    for (let i = 0; i < CHUNK_SIZE; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < CHUNK_SIZE; j++) {
        if (Math.random() > 0.4) {
          this.tiles[i][j] = new Tile(i, j, this, "forest");
        } else {
          this.tiles[i][j] = new Tile(i, j, this);
        }
      }
    }

    this.generate();
  }

  static get size() {
    return CHUNK_SIZE;
  }

  getAdjChunk(direction: Direction) {
    let offset: Position = parseDir(direction);
    return this.world.getChunk(new Position(this.pos.x + offset.x, this.pos.y + offset.y));
  }

  getTile(x: number, y: number) {
    return this.tiles[x][y];
  }

  getTileFromWorldCoords(tileX: number, tileY: number) {
    return this.getTile(
      Math.abs((Chunk.size + tileX) % Chunk.size),
      Math.abs((Chunk.size + tileY) % Chunk.size)
    );
  }

  generate() {
    console.info("Generating: %O", this);
    // Terrain -> structure -> creatures -> player
    let pLvl = store.getters.playerLevel;
    genCreatures(Chunk.size, this.pos.x, this.pos.y, pLvl);
  }
}
