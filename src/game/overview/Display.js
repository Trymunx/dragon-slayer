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

  let bg;

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let tile = world.getTile(x, y);
      if (tile.items.length > 0) {
        bg = `hsla(0, 0%, 100%, ${tile.items.length / 12 + 0.2})`;
      }
      this.draw(j, i, tile.display, tile.foreground, bg);
      j++;
    }
    i++;
  }

  // Draw creatures over tiles
  Object.keys(creatures).forEach(key => {
    let pos = key.split(",");
    let cArr = creatures[key];
    if (pos[0] >= left && pos[0] < right && pos[1] >= top && pos[1] < bot) {
      this.draw(pos[0] - left, pos[1] - top, cArr[0].symbol, levelColour(cArr[0].level), bg);
    }
  });

  // Draw player last
  this.draw(player.pos.x - left, player.pos.y - top, "※", "#fff", bg);
    // symbol = "«※»";
    // symbol = "※";
    // symbol = "🧙";
}

var display = new ROT.Display({
  fg: "#daddd8",
  bg: "#1e1e1e",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true
});

export default display;
