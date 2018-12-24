import ROT from "rot-js";
import store from "../../vuex/store";
import { levelColour } from "../utils/colours";

ROT.Display.prototype.drawWorld = function() {
  let world = store.getters.world;
  let player = store.getters.player;

  this.clear();
  let curOpts = this.getOptions();
  let top = Math.ceil(player.pos.y - curOpts.height / 2);
  let bot = Math.ceil(player.pos.y + curOpts.height / 2);
  let left = Math.ceil(player.pos.x - curOpts.width / 2);
  let right = Math.ceil(player.pos.x + curOpts.width / 2);

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let tile = world.getTile(x, y);

      let symbol, foreground, background;

      if (x === player.pos.x && y === player.pos.y) {
        foreground = "#fff";
        // symbol = "«※»";
        symbol = "※";
        // symbol = "🧙";
      } else if (tile.creatures.length) {
        let highestLvl = Math.max(...tile.creatures.map(creature => creature.level));
        let creature = tile.creatures.find(creature => creature.level === highestLvl);
        symbol = creature.symbol;
        foreground = levelColour(highestLvl);
      } else {
        foreground = tile.foreground;
        symbol = tile.display;
      }

      this.draw(j, i, symbol, foreground, background);
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
