import ROT from "rot-js";
const trees = [
  {
    "symbol": "↟",
    "prob": 20
  },
  {
    "symbol": "🌲",
    "prob": 20
  },
  {
    "symbol": "🌳",
    "prob": 15
  },
  {
    "symbol": "⇞",
    "prob": 12
  },
  {
    "symbol": "↑",
    "prob": 8
  },
  {
    "symbol": "⇈",
    "prob": 6
  },
  {
    "symbol": "⭫",
    "prob": 5
  },
  {
    "symbol": "𐇲",
    "prob": 5
  },
  {
    "symbol": "⇡",
    "prob": 4
  },
  {
    "symbol": "⇑",
    "prob": 4
  },
  {
    "symbol": "⥉",
    "prob": 2
  },
  {
    "symbol": "⭎",
    "prob": 2
  },
  {
    "symbol": "⤒",
    "prob": 2
  },
  {
    "symbol": "⭂",
    "prob": 1
  },
  {
    "symbol": "⭜",
    "prob": 1
  }
]

let total = trees.reduce((sum, el) => {
  return sum += el.prob;
}, 0);
console.log(total);

ROT.Display.prototype.drawWorld = function(world, playerPos) {
  let pChunk = world.getChunkFromTile(playerPos.x, playerPos.y);
  // for (let i = 0; i < pChunk.tiles.length; i++) {
  //   for (let j = 0; j < pChunk.tiles[i].length; j++) {
  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 40; j++) {
      // if (pChunk.tiles[i][j].creatures.length) {
      //   display.draw(i, j, "@");
      // } else {
        let rand = ~~(Math.random() * total);
        let tree = 0;
        while (rand <= tprobs[tree + 1]) {
          tree++
        }

        display.draw(i, j, trees[tree], "#086623");

        // display.draw(i, j, "🌲");
        // display.draw(i, j, "🌳");
        // display.draw(i, j, "⇈");
        // display.draw(i, j, "⇞");
        // display.draw(i, j, "↑");
        // display.draw(i, j, "⇑");
        // display.draw(i, j, "⭫");
        // display.draw(i, j, "𐇲");
        // display.draw(i, j, "⇡");
        // display.draw(i, j, "⭎");
        // display.draw(i, j, "⭚");
        // display.draw(i, j, "⭜");
        // display.draw(i, j, "⭂");
        // display.draw(i, j, "⤒");
        // display.draw(i, j, "⤊");
        // display.draw(i, j, "⥉");
      // }
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
