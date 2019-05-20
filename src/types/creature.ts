export interface Creature {
  name: string;
  hp: number;
  isDead(): boolean;
  level: number;
  pos: Position;
}

