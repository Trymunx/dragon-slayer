import * as ROT from "rot-js";
import CreaturesJSON from "./Creatures.json";
import gameItems from "../items/gameItems";
import { Item } from "../../types";
import { Player } from "./player";
import { RNG } from "../utils/RNG";
import store from "../../vuex/store";
import { ActivityState, Entity, EntityType, HP } from "./entity";
import Position, { getRandomPosInChunk } from "../world/position";

export type CreatureName =
  | "dragon"
  | "giant"
  | "troll"
  | "orc"
  | "goblin"
  | "thief"
  | "skeleton"
  | "ghost"
  | "giant rat"
  | "giant spider"
  | "wolf"
  | "boar"
  | "snake"
  | "rat"
  | "spider"
  | "fox"
  | "deer"
  | "pig"
  | "rabbit";

const AllCreatures = new Map(Object.entries(CreaturesJSON));

interface CreatureAttack {
  chance: number;
  maxDamage: number;
  messages: string[];
  minDamage: number;
  name: string;
}

type WeightedAttackMap = {
  [attackName: string]: number;
};

type HarvestItems = Array<{ name: string; quantity: number[] }>;

interface CreatureTemplate {
  attacks: CreatureAttack[];
  attributes: {
    maxTotalHP: number;
    minTotalHP: number;
    healthBar: string;
    spawnChance: number;
    aggressive: boolean;
  };
  drops: {
    equipment: string[];
    gold: {
      dropChance: number;
      max: number;
    };
    harvest: HarvestItems;
    potions: {
      dropChance: number;
      max: number;
    };
  };
  name: string;
  namePlural: string;
  messages: {
    onDeath: string[];
    onSpawn: string[];
  };
  missChance: number;
}

export class Creature extends Entity {
  aggressive: boolean;
  attacks: CreatureAttack[];
  attacksToWeightsMap: WeightedAttackMap;
  moveSpeed: number;
  slots?: any;
  species: {
    name: CreatureName;
    plural: string;
  };
  target?: Creature | Player;

  constructor({
    level,
    pos,
    template,
  }: {
    level: number;
    pos: Position;
    template: CreatureTemplate;
  }) {
    const moveSpeed = Math.floor(RNG(20, 600));
    const hp = Math.floor(RNG(template.attributes.minTotalHP, template.attributes.maxTotalHP));
    super({
      attributes: {
        armour: 1,
        attackChance: 1 - template.missChance,
        attackSpeed: 35,
        damage: 1,
        dodgeChance: 0.2,
      },
      cooldown: moveSpeed,
      currentActivityState: ActivityState.MOVING,
      hp: {
        current: hp,
        max: hp,
      } as HP,
      items: [] as Item[],
      level: level,
      position: pos as Position,
      symbol: template.attributes.healthBar,
      type: EntityType.Creature,
    });

    this.species = {
      name: template.name as CreatureName,
      plural: template.namePlural,
    };

    this.aggressive = template.attributes.aggressive;

    this.items = template.drops.harvest
      .filter(item => gameItems.has(item.name))
      .map(item => {
        const quantity =
          item.quantity[1] !== 1 ? Math.floor(RNG(item.quantity[0], item.quantity[1])) : 1;
        return gameItems.get(item.name).newItem(quantity);
      })
      .concat(getGold(template.drops.gold));

    this.moveSpeed = moveSpeed;

    this.attacks = template.attacks;
    this.attacksToWeightsMap = this.attacks.reduce(
      (weights, attack) => {
        weights[attack.name] = attack.chance;
        return weights;
      },
      {} as WeightedAttackMap
    );
  }

  attack() {
    if (!this.target) {
      return;
    }

    if (this.attributes.attackChance > RNG()) {
      if (this.target instanceof Creature) {
        store.dispatch("sendMessageAtPosition", {
          entity: "",
          message: `The ${this.species.name} missed the ${this.target.species.name}.`,
          position: this.position,
        });
      } else if (this.target instanceof Player) {
        store.dispatch("addMessage", {
          entity: this.species.name,
          message: `The ${this.species.name} missed you.`,
        });
      }
      return;
    }

    const attackName = ROT.RNG.getWeightedValue(this.attacksToWeightsMap);
    const attack = this.attacks.find(att => att.name === attackName);
    if (!attack) {
      console.error(attackName + " doesn't exist for " + this.species.name);
      return;
    }
    const damage = Math.floor(RNG(attack.minDamage, attack.maxDamage) * this.level) / 1.5;
    this.target.receiveDamage(damage);

    if (this.target instanceof Creature) {
      store.dispatch("sendMessageAtPosition", {
        entity: "",
        message: `The ${this.species.name} used ${attackName} on the ${
          this.target.species.name
        } for ${damage}.`,
        position: this.position,
      });
    } else if (this.target instanceof Player) {
      const attackMessage =
        attack.messages[Math.floor(RNG(attack.messages.length))] + damage + " HP";
      store.dispatch("addMessage", {
        entity: this.species.name,
        message: attackMessage,
      });
    }

    if (this.target.isDead()) {
      this.currentActivityState = ActivityState.MOVING;
      this.cooldown = this.moveSpeed;
      this.level++;
    }
  }

  printHPReport() {
    const totalBarLength = 40;
    const hpPercent = Math.round((this.hp.current / this.hp.max) * 100);
    const currentHPLength = Math.round((totalBarLength / 100) * hpPercent);
    const hpReportString = `[${this.symbol.repeat(currentHPLength).padEnd(totalBarLength)}] (${
      this.hp.current
    }HP)`;
    store.dispatch("sendMessageAtPosition", {
      entity: this.species.name,
      message: hpReportString,
      position: this.position,
    });
  }

  receiveDamage(damage: number) {
    this.hp.current = Math.max(0, this.hp.current - damage);
    if (this.hp.current === 0) {
      store.dispatch("sendMessageAtPosition", {
        entity: "",
        message: `The ${this.species.name} died and dropped ${this.getItemsPrettyOutput()}.`,
        position: this.position,
      });
      this.currentActivityState = ActivityState.DEAD;
      this.dropItems();
    } else {
      this.printHPReport();
    }
  }

  getItemsPrettyOutput(): string {
    const items = this.items.reduce(
      (acc, item) => {
        if (item === undefined) return acc;
        if (acc[item.name]) acc[item.name]++;
        else acc[item.name] = 1;
        return acc;
      },
      {} as { [itemName: string]: number }
    );
    const outputs = Object.keys(items).map(itemName => {
      if (items[itemName] === 1) {
        return `1 ${itemName}`;
      } else {
        // know this is not undefined because we only add to items when things exist in this.items
        return `${items[itemName]} ${this.items.find(el => el.name === itemName)!.plural}`;
      }
    });
    const output =
      outputs.length > 1
        ? outputs.slice(0, -1).join(", ") + ", and " + outputs.slice(-1)
        : outputs[0] || "";

    return output;
  }

  dropItems() {
    store.dispatch("dropItems", { items: this.items.splice(0), pos: this.position });
  }

  move() {
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: new Position(this.position.x, this.position.y - 1),
        });
        this.position.y--;
        break;
      case 1:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: new Position(this.position.x, this.position.y + 1),
        });
        this.position.y++;
        break;
      case 2:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: new Position(this.position.x - 1, this.position.y),
        });
        this.position.x--;
        break;
      case 3:
        store.dispatch("moveCreature", {
          creature: this,
          newPos: new Position(this.position.x + 1, this.position.y),
        });
        this.position.x++;
        break;
    }
  }

  targetCreatures(creatures: Creature[]) {
    for (const c of creatures) {
      if (c === this) {
        continue;
      }
      if (
        c.hp.current < this.hp.current &&
        this.currentActivityState === ActivityState.MOVING &&
        c.currentActivityState === ActivityState.MOVING
      ) {
        console.info(`${this.position.key()}: ${this.species.name} attacking ${c.species.name}`);
        this.currentActivityState = ActivityState.FIGHTING;
        c.currentActivityState = ActivityState.FIGHTING;
        this.target = c;
        c.target = this;
        this.cooldown = this.attributes.attackSpeed;
        c.cooldown = c.attributes.attackSpeed + 10; // aggressor attacks first
      }
    }
  }

  update() {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }

    switch (this.currentActivityState) {
      case ActivityState.MOVING:
        this.cooldown = this.moveSpeed;
        this.move();
        break;
      case ActivityState.FIGHTING:
        this.cooldown = this.attributes.attackSpeed;
        this.attack();
        break;
      case ActivityState.DEAD:
        this.cooldown = 0;
        break;
    }
  }
}

const getGold = ({ max, dropChance }: { max: number; dropChance: number }): Item[] => {
  const gold = [];
  if (RNG() < dropChance) {
    const quantity = Math.floor(RNG(max));
    for (let i = 0; i < quantity; i++) {
      gold.push(gameItems.get("gold").newItem());
    }
  }
  return gold;
};

const getItems = (creatureItemsArray: HarvestItems): Item[] => {
  let items: Item[] = [];
  creatureItemsArray.forEach(item => {
    if (gameItems.has(item.name)) {
      let quantity;
      if (item.quantity[1] !== 1) {
        quantity =
          Math.floor(Math.random() * (item.quantity[1] - item.quantity[0] + 1)) + item.quantity[0];
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

export const genCreatures = (
  chunkSize: number,
  left: number,
  top: number,
  playerLevel: number = 1
) => {
  AllCreatures.forEach(c => {
    let numberInChunk = Math.round(c.attributes.spawnChance * 0.5 * chunkSize ** 2);
    for (let i = 0; i < numberInChunk; i++) {
      let creatureLevel = Math.ceil(Math.random() * playerLevel * 1.5);
      let pos = getRandomPosInChunk(chunkSize, left, top);
      let creature = new Creature({
        level: creatureLevel,
        pos: pos,
        template: c,
      });
      store.dispatch("addCreature", creature);
    }
  });
};
