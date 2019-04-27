import ActivityStates from "./ActivityStates";
import CreaturesJSON from "./Creatures.json";
import gameItems from "../items/gameItems";
import store from "../../vuex/store";

const Creatures = new Map(Object.entries(CreaturesJSON));

class Creature {
  constructor(level, creature, pos) {
    this.name = creature.name;
    this.level = level;
    this.pos = pos;
    this.symbol = creature.attributes.healthBar;

    this.speed = () => ~~(Math.random() * 8000) + 100;
    this.cooldown = this.speed(); // Default timeout before moving
    this.currentActivityState = ActivityStates.MOVING;

    this.items = getItems(creature.drops.harvest);

    this.attr = creature.attributes;
    if (Math.random() < creature.drops.gold.dropChance) {
      this.gold = ~~(Math.random() * creature.drops.gold.max);
    } else {
      this.gold = 0;
    }
  }

  update() {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }

    switch (this.currentActivityState) {
      case ActivityStates.MOVING:
        this.cooldown = this.speed();
        this.move();
        break;
      case ActivityStates.FIGHTING:
        this.cooldown = this.speed();
        // this.attack(this.target);
        break;
      case ActivityStates.DEAD:
        this.cooldown = 0;
        break;
      default:
        console.warn(
          `Unknown activity state for ${this.name} at ${this.pos}: ${this.currentActivityState}`
        );
        break;
    }
  }

  move() {
    let tile = store.getters.world.getTile(this.pos[0], this.pos[1]);
    if (Math.random() < 0.5) tile.items.push(...this.items);
    switch (~~(Math.random() * 4)) {
      case 0:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: [this.pos[0], this.pos[1] - 1],
        });
        this.pos[1]--;
        break;
      case 1:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: [this.pos[0], this.pos[1] + 1],
        });
        this.pos[1]++;
        break;
      case 2:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: [this.pos[0] - 1, this.pos[1]],
        });
        this.pos[0]--;
        break;
      case 3:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: [this.pos[0] + 1, this.pos[1]],
        });
        this.pos[0]++;
        break;
    }
  }
}

const getItems = creatureItemsArray => {
  let items = [];
  creatureItemsArray.forEach(item => {
    if (gameItems.has(item.name)) {
      let quantity;
      if (item.quantity[1] !== 1) {
        quantity = ~~(Math.random() * (item.quantity[1] - item.quantity[0] + 1)) + item.quantity[0];
      } else {
        quantity = 1;
      }
      for (let i = 0; i < quantity; i++) {
        let newItem = gameItems.get(item.name).newItem();
        items.push(newItem);
      }
    }
  });
  return items;
};

const getRandomPos = (chunkSize, left, top) => [
  Math.floor(Math.random() * chunkSize) + left * chunkSize,
  Math.floor(Math.random() * chunkSize) + top * chunkSize,
];

const genCreatures = (chunkSize, left, top, playerLevel = 1) => {
  let chunkCreatures = [];

  Creatures.forEach(c => {
    let numberInChunk = Math.round(c.attributes.spawnChance * 0.5 * chunkSize ** 2);
    for (let i = 0; i < numberInChunk; i++) {
      let creatureLevel = Math.ceil(Math.random() * playerLevel * 1.5);
      let pos = getRandomPos(chunkSize, left, top);
      let creature = new Creature(creatureLevel, c, pos);
      store.dispatch("addCreature", creature);
    }
  });
};

export default genCreatures;
