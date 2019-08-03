import Crafting from "./json/Crafting";
import Food from "./json/Food";
import Ingredients from "./json/Ingredients";
import Trophies from "./json/Trophies";

let gameItems = new Map();

class Item {
  constructor(itemObject) {
    for (const key in itemObject) {
      this[key] = itemObject[key];
    }
  }
}

class ItemFactory {
  constructor(itemObject) {
    for (let key in itemObject) {
      this[key] = itemObject[key];
    }
    this.methods = {};
  }

  newItem() {
    const itemParams = {};
    for (const key in this) {
      if (Array.isArray(this[key]) && key !== "value" && key !== "val") {
        itemParams[key] = Math.floor(getRandomInRange(this[key][0], this[key][1]));
      } else if (key !== "value") {
        itemParams[key] = this[key];
      }
    }
    itemParams.val = this.value.reduce((sum, fn) => (sum += fn(itemParams)), 0);
    return new Item(itemParams);
  }

  addMethod(methodName, fn) {
    this.methods[methodName] = fn;
  }
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random int between item minVal and maxVal mapped on minProp and maxProp inclusive
 * item.val and item.prop are arrays of length 2, with form [min, max]
 */
function getItemValue(item, prop, range) {
  let val = item[prop];
  let slope = (item.val[1] - item.val[0] + 1) / (range[1] - range[0] + 1);
  return Math.floor((val - range[0]) * slope + item.val[0]);
}

Crafting.forEach(i => {
  let item;
  if (!gameItems.has(i.name)) {
    item = new ItemFactory(i);
    item.value = [itemParams => getRandomInRange(itemParams.val[0], itemParams.val[1])];
  } else {
    item = gameItems.get(i.name);
    for (let key in i) {
      item[key] = i[key];
    }
    item.value.push(itemParams => getRandomInRange(itemParams.val[0], itemParams.val[1]));
  }
  if (!item.plural) {
    item.plural = item.name + "s";
  }
  item.addMethod("craft", () => console.log(`Crafting with ${this.name}`));
  gameItems.set(item.name, item);
});

Food.forEach(i => {
  let item;
  if (!gameItems.has(i.name)) {
    item = new ItemFactory(i);
    item.value = [itemParams => getItemValue(itemParams, "heal", i.heal.slice())];
  } else {
    item = gameItems.get(i.name);
    for (let key in i) {
      item[key] = i[key];
    }
    item.value.push(itemParams => getItemValue(itemParams, "heal", i.heal.slice()));
  }
  if (!item.plural) item.plural = item.name;
  item.edible = true;
  item.addMethod("cook", () => (item.uncooked = false));
  gameItems.set(item.name, item);
});

// Gold
// if (!gameItems.has("gold")) {
//   const gold = new ItemFactory({
//     name: "gold",
//     plural: "gold",
//     value: [() => 1],
//   });
//   gameItems.set("gold", gold);
// }

Ingredients.forEach(i => {
  let item;
  if (!gameItems.has(i.name)) {
    item = new ItemFactory(i);
    item.value = [itemParams => getRandomInRange(itemParams.val[0], itemParams.val[1])];
  } else {
    item = gameItems.get(i.name);
    for (let key in i) {
      item[key] = i[key];
    }
    item.value.push(itemParams => getRandomInRange(itemParams.val[0], itemParams.val[1]));
  }
  if (!item.plural) item.plural = item.name;
  item.addMethod("combine", () => console.log(`Using ingredient ${this.name}`));
  gameItems.set(item.name, item);
});

Trophies.forEach(i => {
  let item;
  if (!gameItems.has(i.name)) {
    item = new ItemFactory(i);
    item.value = [itemParams => getRandomInRange(itemParams.val[0], itemParams.val[1])];
  } else {
    item = gameItems.get(i.name);
    for (let key in i) {
      item[key] = i[key];
    }
    item.value.push(itemParams => getRandomInRange(itemParams.val[0], itemParams.val[1]));
  }
  if (!item.plural) {
    item.plural = item.name + "s";
  }
  gameItems.set(item.name, item);
});

export default gameItems;
