import * as ROT from "rot-js";
import { levelColour } from "../utils/colours";
import store from "../../vuex/store";

ROT.Display.prototype.drawWorld = function() {
  const world = store.getters.world;
  const player = store.getters.player;

  this.clear();
  const curOpts = this.getOptions();
  let top = Math.ceil(player.pos[1] - curOpts.height / 2);
  let bot = Math.ceil(player.pos[1] + curOpts.height / 2);
  let left = Math.ceil(player.pos[0] - curOpts.width / 2);
  let right = Math.ceil(player.pos[0] + curOpts.width / 2);
  store.dispatch("setDisplayOrigin", [left, top]);

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let tile = world.getTile(x, y);
      let hl = store.getters.highlit[[x, y]];
      let symbol = tile.display;
      let fg = tile.foreground;
      let bg = "#1e1e1e";
      const creatures = store.getters.creaturesAt(x, y);
      if (creatures) {
        creatures.sort((a, b) => {
          if (a.isDead() && b.isDead()) {
            return 0;
          } else if (a.isDead()) {
            return 1;
          } else if (b.isDead()) {
            return -1;
          } else {
            return b.hp - a.hp;
          }
        });
      }

      if (hl) {
        bg = "#df9";
      } else if (tile.items.length > 0) {
        bg = `hsla(0, 0%, 100%, ${Math.min(tile.items.length / 12, 0.8)})`;
      }

      if (x === player.pos[0] && y === player.pos[1]) {
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

var display = new ROT.Display({
  fg: "#daddd8",
  bg: "#1e1e1e",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true,
});

export default display;
