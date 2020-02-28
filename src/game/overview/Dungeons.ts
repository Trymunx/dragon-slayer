import * as ROT from "rot-js";
import { Display } from "./Display";
import store from "../../vuex/store";

export const drawDungeon = (d: Display) => {
  const dungeon = store.getters.dungeon;
  const { width, height } = d.getOptions();

  if (dungeon) {
    for (let x = 0; x < dungeon.length; x++) {
      for (let y = 0; y < dungeon[x].length; y++) {
        if (dungeon[x][y]) {
          d.draw(x, y, " ", "#1e1e1e", "#000");
        } else {
          d.draw(x, y, " ", "#fff", "#1e1e1e");
        }
      }
    }
  }
};

export const generateDungeon = (width: number, height: number) => {
  const map = new ROT.Map.Uniform(width, height, {
    roomDugPercentage: 0.7,
    roomHeight: [3, 16],
    roomWidth: [3, 16],
  });
  const dungeon: Array<number[]> = [];
  map.create((x, y, val) => {
    if (dungeon[x] === undefined) {
      dungeon[x] = [];
    }
    dungeon[x][y] = val;
  });
  return dungeon;
};
