import ROT from "rot-js";
ROT.Display.prototype.drawWorld = function(world, playerPos) {
  this.clear();
  let curOpts = this.getOptions();
  let top = Math.ceil(playerPos.y - curOpts.height / 2);
  let bot = Math.ceil(playerPos.y + curOpts.height / 2);
  let left = Math.ceil(playerPos.x - curOpts.width / 2);
  let right = Math.ceil(playerPos.x + curOpts.width / 2);

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let chunk = world.getChunkFromTile(x, y);
      let tile = chunk.getTileFromWorldCoords(x, y);

      let symbol, foreground, background;

      if (x === playerPos.x && y === playerPos.y) {
        foreground = "#fff";
        symbol = "X";
      } else if (tile.creatures.length) {
        symbol = "@";
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
