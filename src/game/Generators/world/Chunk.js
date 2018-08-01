import Tile from "./Tile";
import config from "../../config/world";
import parseDirection from "../../utils/ParseDirection";

const chunkSize = config.chunkSize;

export default class Chunk {
  constructor(x, y, world) {
    this.x = x;
    this.y = y;
    this.world = world;
    this.tiles = [];
    for (let i = 0; i < chunkSize; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < chunkSize; j++) {
        this.tiles[i][j] = new Tile(i, j, this);
      }
    }

    this.generate();
  }

  static chunkKey(x, y) {
    return toString(x + "," + y);
  }

  static get size() {
    return chunkSize;
  }

  getAdjChunk(direction) {
    let offset = parseDirection(direction);
    return this.world.getChunk(this.x + offset.x, this.y + offset.y);
  }

  getTile(x, y) {
    return this.tiles[x][y];
  }

  getTileFromWorldCoords(tile_x, tile_y) {
    return this.getTile(tile_x % Chunk.size, tile_y % Chunk.size);
  }

  generate() {
    console.log("Generating: %O", this);
    // Terrain -> structure -> creatures -> player

  }
}
