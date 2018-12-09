import ROT from "rot-js";
const trees = [
  {
    "symbol": "↟",
    "prob": 20
  },
  // {
  //   "symbol": "🌲",
  //   "prob": 20
  // },
  // {
  //   "symbol": "🌳",
  //   "prob": 15
  // },
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

trees.sort((a, b) => b.prob - a.prob);
let total = trees.reduce((acc, el, i) => (el.prob += acc), 0);

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
        let rand = ~~(Math.random() * total);
        let tree = 0;
        while (rand >= trees[tree + 1].prob) {
          tree++
        }
        display.draw(j, i, trees[tree].symbol, "#086623");
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
