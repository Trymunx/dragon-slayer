import ROT from "rot-js";
ROT.Display.prototype.drawWorld = function(world, playerPos) {
  let curOpts = display.getOptions();
  let top = Math.floor(playerPos.y - curOpts.height / 2);
  let bot = Math.floor(playerPos.y + curOpts.height / 2);
  let left = Math.floor(playerPos.x - curOpts.width / 2);
  let right = Math.floor(playerPos.x + curOpts.width / 2);

  for (let i = 0, y = top; y < bot; y++) {
    for (let j = 0, x = left; x < right; x++) {
      let chunk = world.getChunkFromTile(x, y);
      let tile = chunk.getTileFromWorldCoords(x, y);
      if (x === playerPos.x && y === playerPos.y) {
        display.draw(j, i, "X", "#fff");
      } else if (tile.creatures.length) {
        display.draw(j, i, "@");
      } else {
        display.draw(j, i, tile.display, "#086623");
      }
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
