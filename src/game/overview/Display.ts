import * as ROT from "rot-js";
import Creature from "../entities/creatures";
import { levelColour } from "../utils/colours";
import { Player } from "../entities/player";
import Position from "../world/position";
import store from "../../vuex/store";
import Tile from "../world/Tile";
import World from "../world/World";

interface Display extends ROT.Display {
  drawWorld?: () => void;
}

const display: Display = new ROT.Display({
  bg: "#1e1e1e",
  fg: "#daddd8",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true,
});

display.drawWorld = function() {
  const world: World = store.getters.world;
  const player: Player = store.getters.player;

  this.clear();
  const curOpts = this.getOptions();
  let top = Math.ceil(player.pos.y - curOpts.height / 2);
  let bot = Math.ceil(player.pos.y + curOpts.height / 2);
  let left = Math.ceil(player.pos.x - curOpts.width / 2);
  let right = Math.ceil(player.pos.x + curOpts.width / 2);
  store.dispatch("setDisplayOrigin", [left, top]);

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let tile: Tile = world.getTile(new Position(x, y));
      let hl = store.getters.highlit[[x, y].join()];
      let symbol = tile.display;
      let fg = tile.foreground;
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

      if (x === player.pos.x && y === player.pos.y) {
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

      this.draw(j, i, symbol, fg, bg);
      j++;
    }
    i++;
  }
};

export default display;
