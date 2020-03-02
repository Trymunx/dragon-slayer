import * as ROT from "rot-js";
import { Creature } from "../entities/creatures";
import { dispatchAction } from "../../vuex/actions";
import { Dungeon } from "../dungeons/dungeon";
import { levelColour } from "../utils/colours";
import { Player } from "../entities/player";
import { Vector } from "../world/position";
import { getTile, World } from "../world/World";
import store, { WorldState } from "../../vuex/store";

export interface Display extends ROT.Display {
  drawWorld: () => void;
  drawPaused: () => void;
}

export const display = new ROT.Display({
  bg: "#1e1e1e",
  fg: "#daddd8",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true,
}) as Display;

display.drawWorld = function() {
  const gameWorld: World = store.getters.world;
  const player: Player = store.getters.player;

  if (!gameWorld || !player) {
    return;
  }

  switch (store.getters.worldState) {
    case WorldState.Overworld:
      drawOverworld(this, player, gameWorld);
      break;
    case WorldState.Dungeon:
      drawDungeon(this);
      break;
  }
};

const drawOverworld = (d: Display, player: Player, gameWorld: World) => {
  const { bot, left, right, top } = centreDisplay([player.position.x, player.position.y], d);

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      const { tile, world } = getTile(gameWorld, x, y);
      if (!tile || !world) {
        return;
      }
      const hl = store.getters.highlit[[x, y].join()];
      let symbol = tile.tileTemplate.display;
      let fg = tile.tileTemplate.foreground;
      let bg = "#1e1e1e";
      const creatures: Creature[] = store.getters.creaturesAt(x, y);
      if (creatures) {
        creatures.sort((a: Creature, b: Creature) => {
          if (a.isDead() && b.isDead()) {
            return 0;
          } else if (a.isDead()) {
            return 1;
          } else if (b.isDead()) {
            return -1;
          } else {
            return b.hp.current - a.hp.current;
          }
        });
      }

      if (hl) {
        bg = "#df9";
      } else if (tile.items.length > 0) {
        bg = `hsla(0, 0%, 100%, ${Math.min(tile.items.length / 12, 0.8)})`;
      }

      if (x === player.position.x && y === player.position.y) {
        symbol = "※";
        // symbol = "«※»";
        // symbol = "🧙";
        if (hl || tile.items.length > 8) {
          fg = "#000";
        } else {
          fg = "#fff";
        }
      } else if (creatures && creatures.length) {
        if (hl && hl.symbol && hl.colour) {
          symbol = hl.symbol;
          fg = hl.colour;
        } else {
          symbol = creatures[0].symbol;
          fg = creatures[0].isDead() ? "#222" : levelColour(creatures[0].level);
        }
      }

      d.draw(j, i, symbol, fg, bg);
      j++;
    }
    i++;
  }
};

display.drawPaused = function() {
  const curOpts = this.getOptions();
  this.draw(curOpts.width / 2 - 0.5, curOpts.height / 2 - 1.5, "[ Paused ]", "#fff", "#00000000");
};

const drawDungeon = (d: Display) => {
  const dungeon: Dungeon = store.getters.currentDungeon;

  const { bot, left, right, top } = centreDisplay(dungeon.playerPos, d);

  if (!dungeon || !dungeon.walls) {
    return;
  }

  let bg: string, fg: string;

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      if (dungeon.walls[x][y]) {
        fg = "#1e1e1e";
        bg = "#000";
      } else {
        fg = "#fff";
        bg = "#1e1e1e";
      }
      // for (let x = 0; x < dungeon.walls.length; x++) {
      //   for (let y = 0; y < dungeon.walls[x].length; y++) {
      //     if (dungeon.walls[x][y]) {
      //       d.draw(x, y, " ", "#1e1e1e", "#000");
      //     } else {
      //       d.draw(x, y, " ", "#fff", "#1e1e1e");
      //     }
      //   }
      // }
      d.draw(i, j, " ", fg, bg);
      j++;
    }
    i++;
  }
};

const centreDisplay = (playerPos: Vector, d: Display) => {
  d.clear();
  const { width, height } = d.getOptions();
  let top = Math.ceil(playerPos[1] - height / 2);
  let bot = Math.ceil(playerPos[1] + height / 2);
  let left = Math.ceil(playerPos[0] - width / 2);
  let right = Math.ceil(playerPos[0] + width / 2);
  dispatchAction.SetDisplayOrigin([left, top]);
  return { bot, left, right, top };
};
