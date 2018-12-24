import CreaturesJSON from "../db/Creatures.json";

const creatures = new Map(Object.entries(CreaturesJSON));

class Creature {
  constructor(level, creature) {
    this.name = creature.name;
    this.level = level;
    this.symbol = creature.attributes.healthBar;
    // this.items = getItems(this.name);
    this.attr = creature.attributes;
  }
}

const genCreatures = (playerLevel = 1) => {
  let tileCreatures = [];
  creatures.forEach(c => {
    if (Math.random() < c.attributes.spawnChance) {
      tileCreatures.push(new Creature(Math.ceil(Math.random() * playerLevel * 1.5), c));
    }
  });
  return tileCreatures;
}

export default genCreatures;
