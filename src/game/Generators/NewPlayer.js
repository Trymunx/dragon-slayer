import PlayerTemplate from "../db/Player.json";
import GenerateName from "./NameGenerator";

class Inventory {
  constructor() {
    this.items = {};
    for (let item of PlayerTemplate.inventory) {
      this.items[item.key] = Object.assign({}, item);
    }
  }

  getItem(key) {
    return this.items[key];
  }

  addItem(item) {
    let key = item.key;
    let quantity = item.quantity;
    if (this.items[item.key]) { //TODO: check if that's how you find whether an item key is already present
      this.items[key].quantity += quantity;
    } else {
      this.items[key] = Object.assign({ "key": key, "quantity": quantity });
    }
  }

  *[Symbol.iterator]() {
    for (let item of Object.values(this.items)) {
      yield item;
    }
  }
}

class Player {
  constructor(name, level = 1) {
    this.name = name || GenerateName();
    this.level = level;
    this.pos = {x: 0, y: 0};
    this.attributes = Object.assign({}, PlayerTemplate.attributes);
    this.attributes.level = level || this.attributes.level;
    this.attributes.currentHP = this.attributes.totalHP = this.calcMaxHP();

    this.inventory = new Inventory();

    // TODO: Fix equipment list
    this.equipped = Object.assign({}, PlayerTemplate.equipped);
  }

  get isFullHealth() {
    return this.attributes.currentHP >= this.attributes.totalHP;
  }

  heal(amount) {
    let healed = Math.min(this.attributes.totalHP - this.attributes.currentHP, amount);
    this.attributes.currentHP += healed;

    return healed;
  }

  calcMaxHP(level = this.attributes.level) {
    return 10 * ~~((10 * level ** 1.3 + 90) / 10);
  }

  get expToNextLevel() {
    return Math.round(50 * this.attributes.level ** 1.3);
  }
}

const newPlayer = (name, level) => new Player(name, level);
export default newPlayer;
