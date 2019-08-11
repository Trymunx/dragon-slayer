import { dispatchAction } from "../../vuex/actions";
import Position from "../world/position";
import { RNG } from "../utils/RNG";
import store from "../../vuex/store";
import { ActivityState, Entity, EntityType, HumanoidBody, isPlayer } from "./entity";
import { attackSuccessChance, maxDamage } from "../utils/fighting";
import { Creature, CreatureName } from "./creatures";
import { Direction, getRandomDirection } from "../utils/direction";

// export interface Player {
//   creaturesSlain: { [key in CreatureName]?: number };
//   inventory?: any;
//   slots?: any;
// }

export class Player extends Entity {
  creaturesSlain: { [key in CreatureName]?: number };
  name: string;
  xp: number;

  constructor(name: string = "", level: number = 1) {
    super({
      attributes: {
        armour: calculateArmFromLevel(level),
        attackChance: 0.45,
        attackSpeed: 30,
        damage: calculateDmgFromLevel(level),
        dodgeChance: 0.15,
      },
      cooldown: 35,
      currentActivityState: ActivityState.MOVING,
      equipmentSlots: {
        arms: [
          {
            fingers: [
              { equipped: null },
              { equipped: null },
              { equipped: null },
              { equipped: null },
            ],
            hand: {
              equipped: null,
            },
            wrist: {
              equipped: null,
            },
          },
          {
            fingers: [
              { equipped: null },
              { equipped: null },
              { equipped: null },
              { equipped: null },
            ],
            hand: {
              equipped: null,
            },
            wrist: {
              equipped: null,
            },
          },
        ],
        back: {
          equipped: null,
        },
        feet: {
          equipped: null,
        },
        heads: [
          {
            head: { equipped: null },
            neck: { equipped: null },
          },
        ],
        legs: { equipped: null },
        torso: { equipped: null },
        waist: { equipped: null },
      },
      hp: {
        current: calculateMaxHPFromLevel(level),
        max: calculateMaxHPFromLevel(level),
      },
      items: [],
      level: level,
      position: new Position(0, 0),
      symbol: "|",
      type: EntityType.Player,
    });

    this.name = name;
    this.creaturesSlain = {};
    this.xp = 0;
  }

  get isFullHealth(): boolean {
    return this.hp.current >= this.hp.max;
  }

  get xpPercentage(): number {
    return this.xp / this.xpToNextLevel;
  }

  get xpToNextLevel(): number {
    return Math.round(50 * this.level ** 1.3);
  }

  addXP(xp: number) {
    this.xp += xp;
    while (this.xpToNextLevel < this.xp) {
      this.xp -= this.xpToNextLevel;
      this.levelUp();
    }
  }

  attack() {
    if (this.target === undefined || this.target.isDead() || isPlayer(this.target)) {
      dispatchAction.AddMessage({
        entity: "Game",
        message: "There is nothing to attack!",
      });
      this.target = undefined;
      this.currentActivityState = ActivityState.MOVING;
      return;
    }

    const successChance = attackSuccessChance(
      this.attributes.attackChance,
      this.target.attributes.dodgeChance
    );

    if (successChance < RNG()) {
      dispatchAction.AddMessage({
        entity: this.name,
        message: `You missed the ${this.target.species.name}.`,
      });
      return;
    }

    // maxDamage gives value between 1 and this.attributes.damage.
    // We use Math.ceil because we want 1 to be the minimum damage value.
    const maxDmg = maxDamage(this.attributes.damage, this.target.attributes.armour);
    const damage = Math.ceil(RNG(maxDmg));

    dispatchAction.AddMessage({
      entity: this.name,
      message: `You attack the ${this.target.species.name} for ${damage}HP.`,
    });

    this.target.receiveDamage(damage);

    if (this.target.isDead()) {
      this.addXP(Math.round((this.target.hp.max * this.target.level) / 1.5));
      this.currentActivityState = ActivityState.MOVING;
    }
  }

  heal(amount: number): number {
    const healed = Math.min(this.hp.max - this.hp.current, amount);
    this.hp.current += healed;

    return healed;
  }

  levelUp() {
    this.level++;
    this.attributes.damage += Math.round(this.level ** 0.5);
    this.attributes.armour += Math.round(this.level ** 0.5);
    this.hp.max = calculateMaxHPFromLevel(this.level);

    dispatchAction.AddMessage({
      entity: "Level up",
      message: `Congratulations! You are now level ${this.level}.`,
    });
  }

  printHPReport() {
    const totalBarLength = 40;
    const hpPercent = Math.round((this.hp.current / this.hp.max) * 100);
    const currentHPLength = Math.round((totalBarLength / 100) * hpPercent);
    const hpReportString = `[${this.symbol.repeat(currentHPLength).padEnd(totalBarLength)}] (${
      this.hp.current
    }HP)`;
    dispatchAction.AddMessage({
      entity: this.name,
      message: hpReportString,
    });
  }

  receiveDamage(damage: number) {
    this.hp.current = Math.max(0, this.hp.current - damage);
    if (this.hp.current === 0) {
      dispatchAction.AddMessage({
        entity: "",
        message: "Game over.", // Do creature report here
      });
      this.currentActivityState = ActivityState.DEAD;
    } else {
      this.printHPReport();
    }
  }

  run(dir?: Direction) {
    if (!this.target || this.target instanceof Player) {
      dispatchAction.AddMessage({
        entity: "",
        message: "You can't run away when you aren't being attacked.",
      });
      return;
    }
    if (RNG() < 0.5) {
      this.target.target = undefined;
      this.target.currentActivityState = ActivityState.MOVING;

      this.target = undefined;
      this.currentActivityState = ActivityState.MOVING;

      if (dir) {
        dispatchAction.MovePlayer(dir);
      } else {
        dispatchAction.MovePlayer(getRandomDirection());
      }

      dispatchAction.AddMessage({
        entity: "",
        message: "You manage to run away.",
      });
    } else {
      dispatchAction.AddMessage({
        entity: "Can't escape!",
        message: `You attempt to run but the ${
          this.target.species.name
        } prevents you from fleeing.`,
      });
    }
  }

  targetCreature(creature: Creature) {
    this.target = creature;
    this.currentActivityState = ActivityState.FIGHTING;

    dispatchAction.AddMessage({
      entity: "",
      message: creature.getSpawnMessage(),
    });

    creature.target = this;
    creature.currentActivityState = ActivityState.FIGHTING;
    creature.cooldown = 20;

    this.attack();
  }

  update() {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }

    this.cooldown = this.attributes.attackSpeed;

    switch (this.currentActivityState) {
      case ActivityState.FIGHTING:
        this.attack();
        break;
    }
  }
}

const calculateMaxHPFromLevel = (level: number): number =>
  10 * Math.floor((10 * level ** 1.3 + 90) / 10);

const calculateDmgFromLevel = (level: number): number => 9 + sumToOneSqrt(level);
const calculateArmFromLevel = (level: number): number => 9 + sumToOneSqrt(level);

const sumToOneSqrt = (x: number): number => {
  if (x === 1) return 1;
  return Math.round(x ** 0.5) + sumToOneSqrt(x - 1);
};
