import genTree from "../../utils/GenerateTree.js";
import genCreatures from "../genCreatures.js";
import GData from "../../db/GameData.js";

export default class Tile {
  constructor(x, y, chunk, terrain) {
    this.relx = x; // x relative to chunk
    this.rely = y; // y relative to chunk
    this.chunk = chunk;
    // this.playerHere = false;
    this.discovered = true; // TODO: Make false to enable discovery fog
    if (Math.random() > 0.95) this.creatures = genCreatures();
    else this.creatures = [];
    this.items = [];
    // this.structures = [];
    this.display;
    this.terrain = terrain; // terrain features, eg. forest, rivers or hills
    switch (this.terrain) {
      case "forest":
        this.display = genTree();
        this.foreground = "#086623";
        break;
      default:
        this.display = "·";
        this.foreground = "#855e40"
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
