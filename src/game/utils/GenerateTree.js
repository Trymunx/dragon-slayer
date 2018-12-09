const genTree = () => {
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
  ];

  trees.sort((a, b) => b.prob - a.prob);
  let total = trees.reduce((acc, el, i) => (el.prob += acc), 0);
  let rand = ~~(Math.random() * total);
  let tree = 0;
  while (rand >= trees[tree + 1].prob) {
    tree++
  }
  return trees[tree].symbol;
}

export default genTree;
