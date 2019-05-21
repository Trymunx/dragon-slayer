import * as ROT from "rot-js";
import CreaturesJSON from "./Creatures.json";
import gameItems from "../items/gameItems";
import { HP } from "./sharedTypes";
import { Item } from "../../types";
import { Player } from "./player";
import Position from "../world/position";
import RNG from "../utils/RNG";
import store from "../../vuex/store";

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

enum ActivityState {
  MOVING = "moving",
  FIGHTING = "fighting",
  DEAD = "dead",
}

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
    harvest: Array<{ name: string; quantity: [number, number] }>;
    potions: {
      dropChance: number;
      max: number;
    };
  };
  name: CreatureName;
  namePlural: string;
  messages: {
    onDeath: string[];
    onSpawn: string[];
  };
  missChance: number;
}

export default class Creature {
  attacks: CreatureAttack[];
  attackSpeed: number;
  attacksToWeightsMap: WeightedAttackMap;
  cooldown: number;
  currentActivityState: ActivityState;
  name: CreatureName;
  hp: HP;
  items: Item[];
  level: number;
  missChance: number;
  moveSpeed: number;
  pos: Position;
  slots?: any;
  symbol: string;
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
    this.name = template.name;
    const hp = ~~RNG(template.attributes.minTotalHP, template.attributes.maxTotalHP);
    this.hp = {
      current: hp,
      max: hp,
    };
    this.level = level;
    this.pos = pos;
    this.symbol = template.attributes.healthBar;

    this.items = template.drops.harvest
      .filter(item => gameItems.has(item.name))
      .map(item => {
        const quantity = item.quantity[1] !== 1 ? ~~RNG(item.quantity[0], item.quantity[1]) : 1;
        return gameItems.get(item.name).newItem(quantity);
      });

    this.currentActivityState = ActivityState.MOVING;
    this.attackSpeed = 35;
    this.moveSpeed = ~~RNG(20, 600);
    this.cooldown = this.moveSpeed;

    this.missChance = template.missChance;
    this.attacks = template.attacks;
    this.attacksToWeightsMap = this.attacks.reduce(
      (weights, attack) => {
        weights[attack.name] = attack.chance;
        return weights;
      },
      {} as WeightedAttackMap
    );
  }

  isDead(): boolean {
    return this.currentActivityState === ActivityState.DEAD;
  }
}
