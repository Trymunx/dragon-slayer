import Chunk from "./Chunk";
import { Player } from "../entities/player";
import Position from "./position";
import { RNG } from "../utils/RNG";
import Tile from "./Tile";

export default class World {
  chunks: Map<string, Chunk>;
  spawnChunk: Chunk;

  constructor() {
    this.chunks = new Map();

    // Generate starting chunk
    this.spawnChunk = this.genChunk(new Position(0, 0));
    // Generate surrounding chunks
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(c => {
      console.log("generating chunk", c[0], c[1]);
      this.genChunk(new Position(c[0], c[1]));
    });

    // constructor(type, size) {
    //   this.chunks = new Map();
    //   this.type = type; // Example types: dungeon, forest, dragon-lair
    //   this.size = size > 0 ? size : 8; // Arbitrary limit for player spawn chunk
    //   let spawnChunk = this.genChunk(Math.floor(RNG(this.size)), Math.floor(RNG(this.size)));
  }

  getChunk(pos: Position) {
    return this.chunks.get(pos.key());
  }

  chunkExists(pos: Position): boolean {
    return this.chunks.has(pos.key());
  }

  genChunk(pos: Position) {
    let chunk = new Chunk(pos.x, pos.y, this);
    this.chunks.set(pos.key(), chunk);
    return chunk;
  }

  getChunkFromTile(tile: Position): Chunk {
    const chunkCoords = new Position(
      Math.floor(tile.x / Chunk.size),
      Math.floor(tile.y / Chunk.size)
    );
    if (this.chunkExists(chunkCoords)) {
      return this.getChunk(chunkCoords)!;
    } else {
      return this.genChunk(chunkCoords);
    }
  }

  getTile(pos: Position): Tile {
    return this.getChunkFromTile(pos).getTileFromWorldCoords(pos.x, pos.y);
  }
}
