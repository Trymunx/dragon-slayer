import Food from "./Food";

let gameItems = new Map();

class Item {
  constructor(itemObject) {
    for (const key in itemObject) {
      this[key] = itemObject[key]
    }
  }
}

class ItemConstructor {
  constructor(itemObject) {
    for (let key in itemObject) {
      this[key] = itemObject[key];
    }
    this.methods = {};
  }

  newItem() {
    const itemParams = {};

    for (const key in this) {
      if (key === "value") {
        itemParams[key] = this[key].reduce((sum, fn) => sum += fn(), 0);
      } else if (Array.isArray(this[key])) {
        itemParams[key] = ~~getRandomInRange(this[key][0], this[key][1]);
      } else {
        itemParams[key] = this[key];
      }
    }

    return new Item(itemParams)
  }

  addMethod(methodName, fn) {
    this.methods[methodName] = fn;
  }
}

function getRandomInRange(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random int between item minVal and maxVal mapped on minProp and maxProp inclusive
 * item.val and item.prop are arrays of length 2, with form [min, max]
 */
function getItemValue(item, prop) {
  let val = getRandomInRange(item[prop][0], item[prop][1]);
  let slope = (item.val[1] - item.val[0] + 1) / (item[prop][1] - item[prop][0] + 1);
  return ~~((val - item[prop][0]) * slope + item.val[0]);
}

Food.forEach(i => {
  let item;
  if (!gameItems.has(i.name)) {
    item = new ItemConstructor(i);
    let valueFn = function() {getItemValue(this, "heal")};
    item.value = [valueFn.bind(i)];
  } else {
    item = gameItems.get(i.name);
    for (let key in i) {
      item[key] = i[key];
    }
    let valueFn = function() {getItemValue(this, "heal")};
    // item.value = [valueFn.bind(i)];
    item.value.push(valueFn.bind(i));
  }
  item.edible = true;
  item.addMethod("eat", () => item.uncooked = false);
  gameItems.set(item.name, item);
});

export default gameItems;
