import Chunk from "./Chunk";
import { Player } from "../entities/player";
import { RNG } from "../utils/RNG";
import Tile from "./Tile";
import { Vector, VTS } from "./position";

export default class World {
  chunks: {
    [origin: string]: Chunk;
  };
  spawnChunk: Chunk;

  constructor() {
    this.chunks = {};

    // Generate starting chunk
    this.spawnChunk = this.genChunk(0, 0);
    // Generate surrounding chunks
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(c => {
      // console.log("generating chunk", c[0], c[1]);
      this.genChunk(...(c as [number, number]));
    });

    // constructor(type, size) {
    //   this.chunks = new Map();
    //   this.type = type; // Example types: dungeon, forest, dragon-lair
    //   this.size = size > 0 ? size : 8; // Arbitrary limit for player spawn chunk
    //   let spawnChunk = this.genChunk(Math.floor(RNG(this.size)), Math.floor(RNG(this.size)));
  }

  getChunk(x: number, y: number) {
    return this.chunks[VTS(x, y)];
  }

  chunkExists(x: number, y: number): boolean {
    return this.chunks[VTS(x, y)] !== undefined;
  }

  genChunk(x: number, y: number) {
    let chunk = new Chunk(x, y, this);
    this.chunks[VTS(x, y)] = chunk;
    return chunk;
  }

  getChunkFromTile(x: number, y: number): Chunk {
    const chunkCoords: Vector = [Math.floor(x / Chunk.size), Math.floor(y / Chunk.size)];
    if (this.chunkExists(...chunkCoords)) {
      return this.getChunk(...chunkCoords)!;
    } else {
      return this.genChunk(...chunkCoords);
    }
  }

  getTile(x: number, y: number): Tile {
    return this.getChunkFromTile(x, y).getTileFromWorldCoords(x, y);
  }
}
