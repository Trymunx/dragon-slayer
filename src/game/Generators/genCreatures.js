import CreaturesJSON from "../db/Creatures.json";
import store from "../../vuex/store";

const Creatures = new Map(Object.entries(CreaturesJSON));

class Creature {
  constructor(level, creature, pos) {
    this.name = creature.name;
    this.level = level;
    this.pos = pos;
    this.symbol = creature.attributes.healthBar;
    // this.items = getItems(this.name);
    this.attr = creature.attributes;
    if (Math.random() < creature.drops.gold.dropChance) {
      this.gold = ~~(Math.random() * creature.drops.gold.max);
    } else {
      this.gold = 0;
    }
  }
}

const getRandomPos = (chunkSize, left, top) => ([
  Math.floor(Math.random() * chunkSize) + left * chunkSize,
  Math.floor(Math.random() * chunkSize) + top * chunkSize,
]);

const genCreatures = (chunkSize, left, top, playerLevel = 1) => {
  let chunkCreatures = [];

  Creatures.forEach(c => {
    let numberInChunk = Math.round(c.attributes.spawnChance * 0.5 * chunkSize ** 2);
    for (let i = 0; i < numberInChunk; i++) {
      let creatureLevel = Math.ceil(Math.random() * playerLevel * 1.5);
      let pos = getRandomPos(chunkSize, left, top);
      let creature = new Creature(creatureLevel, c, pos);
      store.dispatch("addCreature", creature)
    }
  });
}

export default genCreatures;
