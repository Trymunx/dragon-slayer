import ActivityStates from "./ActivityStates";
import CreaturesJSON from "./Creatures.json";
import gameItems from "../items/gameItems";
import RNG from "../utils/RNG";
import ROT from "rot-js";
import store from "../../vuex/store";

const Creatures = new Map(Object.entries(CreaturesJSON));

class Creature {
  constructor(level, creature, pos) {
    this.name = creature.name;
    this.level = level;
    this.pos = pos;
    this.symbol = creature.attributes.healthBar;
    this.hp = ~~RNG(creature.attributes.minTotalHP, creature.attributes.maxTotalHP);
    this.totalHP = this.hp;

    this.moveSpeed = () => ~~RNG(20, 600);
    this.attackSpeed = () => 35;
    this.cooldown = this.moveSpeed(); // Default timeout before moving
    this.target = null;

    this.currentActivityState = ActivityStates.MOVING;
    this.isDead = () => this.currentActivityState === ActivityStates.DEAD;

    this.items = getItems(creature.drops.harvest);

    this.missChance = creature.missChance;
    this.weightedAttacks = creature.attacks.reduce((weights, attack) => {
      weights[attack.name] = attack.chance;
      return weights;
    }, {});
    this.attacks = creature.attacks.reduce((attacks, attack) => {
      attacks[attack.name] = attack;
      return attacks;
    }, {});

    this.attr = creature.attributes;
    if (Math.random() < creature.drops.gold.dropChance) {
      this.gold = ~~RNG(creature.drops.gold.max);
    } else {
      this.gold = 0;
    }
  }

  attack(target) {
    const attackChance = RNG();
    if (attackChance > this.missChance) {
      const attack = ROT.RNG.getWeightedValue(this.weightedAttacks);
      const damage = ~~RNG(this.attacks[attack].minDamage, this.attacks[attack].maxDamage);

      store.dispatch("sendMessageAtPosition", {
        entity: "",
        message: `The ${this.name} used ${attack} on the ${target.name} for ${damage}.`,
        position: this.pos,
      });

      target.hp = Math.max(0, target.hp - damage);
      if (target.hp === 0) {
        store.dispatch("sendMessageAtPosition", {
          entity: "",
          message: `The ${target.name} died and dropped ${target.gold} gold.`,
          position: this.pos,
        });
        target.currentActivityState = ActivityStates.DEAD;
        target.dropItems();
      } else {
        store.dispatch("sendMessageAtPosition", {
          entity: target.name,
          message: target.getHPReport(),
          position: target.pos,
        });
      }
    } else {
      store.dispatch("sendMessageAtPosition", {
        entity: "",
        message: `The ${this.name} missed the ${target.name}.`,
        position: this.pos,
      });
    }

    if (target.isDead()) {
      this.currentActivityState = ActivityStates.MOVING;
      this.cooldown = this.moveSpeed();
    }
  }

  dropItems() {
    const tile = store.getters.world.getTile(...this.pos);
    tile.items.push(...this.items);
    if (this.gold) {
      console.log(this.gold);
      tile.items.push(this.gold);
    }
  }

  getHPReport() {
    const totalBarLength = 40;
    const hpPercent = Math.round((this.hp / this.totalHP) * 100);
    const currentHPLength = Math.round((totalBarLength / 100) * hpPercent);

    return `[${this.symbol.repeat(currentHPLength).padEnd(totalBarLength)}] (${this.hp}HP)`;
  }

  move() {
    let tile = store.getters.world.getTile(this.pos[0], this.pos[1]);
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

  targetCreatures(creatures) {
    for (const c of creatures) {
      if (c === this) {
        continue;
      }
      if (
        c.hp < this.hp &&
        this.currentActivityState === ActivityStates.MOVING &&
        c.currentActivityState === ActivityStates.MOVING
      ) {
        console.log(`${this.pos}: ${this.name} attacking ${c.name}`);
        this.currentActivityState = ActivityStates.FIGHTING;
        c.currentActivityState = ActivityStates.FIGHTING;
        this.target = c;
        c.target = this;
        this.cooldown = this.attackSpeed();
        c.cooldown = c.attackSpeed() + 10; // aggressor attacks first
      }
    }
  }

  update() {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }

    switch (this.currentActivityState) {
      case ActivityStates.MOVING:
        this.cooldown = this.moveSpeed();
        this.move();
        break;
      case ActivityStates.FIGHTING:
        this.cooldown = this.attackSpeed();
        this.attack(this.target);
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
