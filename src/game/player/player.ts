import GenerateName from "../utils/nameGenerator";
import { Player, Position } from "../../types";
import PlayerTemplate from "./PlayerTemplate.json";

function newPlayer(name: string, level: number): Player {
  const player = {
    attributes: Object.assign({}, PlayerTemplate.attributes),
    hp: {
      current: 100,
      max: 100,
    },
    level,
    name: name || GenerateName(),
    pos: [0, 0] as Position,
  };

  return player;
}
