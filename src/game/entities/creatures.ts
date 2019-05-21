import Position from "../world/position";

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

export default class Creature {
  name: string;
  hp: number;
  level: number;
  pos: Position;
  symbol: string;

  constructor({
    name,
    hp,
    level,
    pos,
    symbol,
  }: {
    name: string;
    hp: number;
    level: number;
    pos: Position;
    symbol: string;
  }) {
    this.name = name;
    this.hp = 10;
    this.level = 1;
    this.pos = new Position(pos.x, pos.y);
    this.symbol = symbol;
  }

  isDead(): boolean {
    return this.hp <= 0;
  }
}
