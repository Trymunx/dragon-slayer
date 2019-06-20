import { CreatureName } from "./creatures";
import GenerateName from "../utils/nameGenerator";
import Position from "../world/position";
import store from "../../vuex/store";
import { ActivityState, HumanoidBody, Entity, EntityType } from "./entity";

// export interface Player {
//   creaturesSlain: { [key in CreatureName]?: number };
//   inventory?: any;
//   slots?: any;
// }

export class Player extends Entity {
  creaturesSlain: { [key in CreatureName]?: number };
  name: string;

  constructor(name: string = "", level: number = 1) {
    super({
      attributes: {
        armour: 0,
        attackChance: 0.45,
        attackSpeed: 30,
        damage: 10,
        dodgeChance: 0.15,
      },
      cooldown: 35,
      currentActivityState: ActivityState.MOVING,
      equipmentSlots: {
        back: {
          equipped: null,
        },
        feet: {
          equipped: null,
        },
        hands: [
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
        current: 100,
        max: 100,
      },
      items: [],
      level: level,
      position: new Position(0, 0),
      symbol: "|",
      type: EntityType.Player,
      xp: 0,
    });

    this.name = name;
    this.creaturesSlain = {};
  }

  printHPReport() {
    const totalBarLength = 40;
    const hpPercent = Math.round((this.hp.current / this.hp.max) * 100);
    const currentHPLength = Math.round((totalBarLength / 100) * hpPercent);
    const hpReportString = `[${this.symbol.repeat(currentHPLength).padEnd(totalBarLength)}] (${
      this.hp.current
    }HP)`;
    store.dispatch("addMessage", {
      entity: this.name,
      message: hpReportString,
    });
  }

  receiveDamage(damage: number) {
    this.hp.current = Math.max(0, this.hp.current - damage);
    if (this.hp.current === 0) {
      store.dispatch("addMessage", {
        entity: "",
        message: "Game over.", // Do creature report here
      });
      this.currentActivityState = ActivityState.DEAD;
    } else {
      this.printHPReport();
    }
  }
}
