import { CreatureName } from "./creatures";
import GenerateName from "../utils/nameGenerator";
import Position from "../world/position";
import { EntityType, HP } from "./sharedTypes";

export interface Player {
  attributes?: IAttributes;
  creaturesSlain: { [key in CreatureName]?: number };
  hp: HP;
  inventory?: any;
  isDead: () => boolean;
  level: number;
  name: string;
  slots?: any;
  pos: Position;
  receiveDamage: (damage: number) => void;
  type: EntityType;
  xp: number;
}

interface IAttributes {
  armour: number;
  attackChance: number;
  damage: number;
  dodgeChance: number;
}

const basePlayer: Player = {
  attributes: {
    armour: 0,
    attackChance: 0.45,
    damage: 10,
    dodgeChance: 0.15,
  },
  creaturesSlain: {},
  hp: {
    current: 100,
    max: 100,
  },
  isDead: function() {
    return this.hp.current <= 0;
  },
  level: 1,
  name: "",
  pos: new Position(0, 0),
  receiveDamage: function(damage) {
    this.hp.current = Math.max(0, this.hp.current - damage);
  },
  type: EntityType.Player,
  xp: 0,
};

export default function newPlayer(name?: string, level?: number): Player {
  return Object.assign(basePlayer, { level, name });
}
