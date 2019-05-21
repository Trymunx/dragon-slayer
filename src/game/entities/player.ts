import { CreatureName } from "./creatures";
import GenerateName from "../utils/nameGenerator";
import { HP } from "./sharedTypes";
import Position from "../world/position";

export interface Player {
  attributes?: IAttributes;
  creaturesSlain: { [key in CreatureName]?: number };
  inventory?: any;
  hp: HP;
  level: number;
  name: string;
  slots?: any;
  pos: Position;
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
  level: 1,
  name: "",
  pos: new Position(0, 0),
  xp: 0,
};

export default function newPlayer(name?: string, level?: number): Player {
  return Object.assign(basePlayer, { level, name });
}
