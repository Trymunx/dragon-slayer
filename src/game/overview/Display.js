import ROT from "rot-js";

ROT.Display.prototype.drawWorld = function(world, playerPos) {
  let pChunk = world.getChunkFromTile(playerPos.x, playerPos.y);
  for (let i = 0; i < pChunk.tiles.length; i++) {
    for (let j = 0; j < pChunk.tiles[i].length; j++) {
      if (pChunk.tiles[i][j].creatures.length) {
        display.draw(i, j, "@");
      } else {
        display.draw(i, j, "↟");
      }
    }
  }
}

var display = new ROT.Display({
  fg: "#daddd8",
  bg: "#1e1e1e",
  // bg: "#9e9e9e", // For debugging
  forceSquareRatio: true
});

export default display;
