import genTree from "../../utils/GenerateTree.js";

export default class Tile {
  constructor(x, y, chunk, terrain) {
    this.relx = x; // x relative to chunk
    this.rely = y; // y relative to chunk
    this.chunk = chunk;
    // this.playerHere = false;
    this.discovered = true; // TODO: Make false to enable discovery fog
    this.creatures = [];
    this.items = [];
    // this.structures = [];
    this.display;
    this.terrain = terrain; // No terrain features, eg. rivers or hills
    switch (this.terrain) {
      case "forest":
        this.display = genTree();
        break;
      default:
        this.display = ".";
        break;
    }
    // this.generators = [];
    this.spawnRateModifiers = new Map();
  }

  setSpawnRateMod (creature, spawnrate) {
    this.spawnRateModifiers.set(creature, spawnrate);
  }
  
  getSpawnRateMod (creature) {
    return this.spawnRateModifiers.has(creature) ? this.spawnRateModifiers.get(creature) : 1;
  }

}
