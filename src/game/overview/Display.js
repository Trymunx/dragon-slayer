import ROT from "rot-js";
import store from "../../vuex/store";
import { levelColour } from "../utils/colours";

ROT.Display.prototype.drawWorld = function() {
  let world = store.getters.world;
  let creatures = store.getters.creatures;
  let player = store.getters.player;

  this.clear();
  let curOpts = this.getOptions();
  let top = Math.ceil(player.pos.y - curOpts.height / 2);
  let bot = Math.ceil(player.pos.y + curOpts.height / 2);
  let left = Math.ceil(player.pos.x - curOpts.width / 2);
  let right = Math.ceil(player.pos.x + curOpts.width / 2);
  store.dispatch("setDisplayOrigin", {x: left, y: top});

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let tile = world.getTile(x, y);
      let hl = store.getters.highlit[[x, y]];
      let symbol = tile.display;
      let fg = tile.foreground;
      let bg = "#1e1e1e";

      if (hl) {
        bg = "#fff";
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
      } else if (creatures[[x, y]] && creatures[[x, y]].length) {
        if (hl) {
          symbol = hl.symbol;
          fg = hl.colour;
        } else {
          symbol = creatures[[x, y]][0].symbol;
          fg = levelColour(creatures[[x, y]][0].level);
        }
      }

      this.draw(j, i, symbol, fg, bg);
      j++;
    }
    i++;
  }
}

var display = new ROT.Display({
  fg: "#daddd8",
  bg: "#1e1e1e",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true
});

export default display;
