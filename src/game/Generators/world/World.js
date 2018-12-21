import Chunk from "./Chunk";
import RNG from "../../utils/RNG";

export default class World {
  constructor() {
    this.chunks = new Map();

    // Generate starting chunk
    this.spawnChunk = this.genChunk(0, 0);
    // Generate surrounding chunks
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(c => {
      this.genChunk(c[0], c[1]);
    });

  // constructor(type, size) {
  //   this.chunks = new Map();
  //   this.type = type; // Example types: dungeon, forest, dragon-lair
  //   this.size = size > 0 ? size : 8; // Arbitrary limit for player spawn chunk
  //   let spawnChunk = this.genChunk(~~(RNG(this.size)), ~~(RNG(this.size)));
  }
  getChunk(chunkX, chunkY) {
    return this.chunks.get(Chunk.chunkKey(chunkX, chunkY));
  }
  chunkExists(chunkX, chunkY) {
    return this.chunks.has(Chunk.chunkKey(chunkX, chunkY));
  }
  genChunk(chunkX, chunkY) {
    let chunk = new Chunk(chunkX, chunkY, this);
    this.chunks.set(Chunk.chunkKey(chunkX, chunkY), chunk);
    return chunk;
  }
  getChunkFromTile(tile_x, tile_y) {
    // Can't use ~~ here because values can be negative
    let chunkCoords = [Math.floor(tile_x / Chunk.size), Math.floor(tile_y / Chunk.size)];
    if (this.chunkExists(...chunkCoords)) {
      return this.getChunk(...chunkCoords);
    } else {
      return this.genChunk(...chunkCoords);
    }
  }
  placePlayer(player, chunk = this.spawnChunk) {
    let playerPos = randomPosition();
    var playerPlaced = false;
    while (!playerPlaced) {
      let tile = chunk.getTile(playerPos);
      if (tile.terrain.length !== 0) {
        playerPos = randomPosition();
      } else {
        tile.creature = null;
        tile.playerIsHere = true;
        tile.discovered = true;
        // revealSurroundings(playerPos, map);
        playerPlaced = true;
        // player.position = playerPos;
        player.pos.chunk = {x: chunk.x, y: chunk.y};
        player.pos.tile = playerPos;
      }
    }
  }
}

function randomPosition() {
  return {
    x: ~~(RNG(Chunk.size)),
    y: ~~(RNG(Chunk.size))
  }
}
