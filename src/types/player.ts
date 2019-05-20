import { Position } from "./position";

export interface Player {
  attributes?: any;
  hp: {
    current: number;
    max: number;
  };
  level: number;
  name: string;
  pos: Position;
}
