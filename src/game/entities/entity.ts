import { Creature } from "./creatures";
import { Item } from "../../types";
import { Player } from "./player";
import Position from "../world/position";

interface IAttributes {
  armour: number;
  attackChance: number;
  attackSpeed: number;
  damage: number;
  dodgeChance: number;
}

export enum EntityType {
  Creature,
  Player,
}

export const isPlayer = (entity: Creature | Player): entity is Player =>
  (<Creature>entity).type === EntityType.Player;

export enum ActivityState {
  MOVING = "moving",
  FIGHTING = "fighting",
  DEAD = "dead",
}

export interface HP {
  current: number;
  max: number;
}

// type EquipmentSlotName =
//   | "head"
//   | "neck"
//   | "torso"
//   | "back"
//   | "wrist"
//   | "hand"
//   | "finger"
//   | "waist"
//   | "legs"
//   | "feet";

interface EquipmentSlot {
  equipped: Item | null;
  // name: EquipmentSlotName;
}

export interface HumanoidBody {
  arms?: Array<{
    fingers: Array<EquipmentSlot>;
    hand: EquipmentSlot;
    wrist: EquipmentSlot;
  }>;
  back: EquipmentSlot;
  feet: EquipmentSlot;
  heads: Array<{
    head: EquipmentSlot;
    neck: EquipmentSlot;
  }>;
  legs: EquipmentSlot;
  torso: EquipmentSlot;
  waist: EquipmentSlot;
}

export class Entity {
  attributes: IAttributes;
  cooldown: number;
  currentActivityState: ActivityState;
  equipmentSlots?: HumanoidBody;
  hp: HP;
  items: Item[];
  level: number;
  position: Position;
  symbol: string;
  target?: Creature | Player;
  type: EntityType;
  xp?: number;

  constructor({
    attributes,
    cooldown,
    currentActivityState,
    equipmentSlots,
    hp,
    items,
    level,
    position,
    symbol,
    target,
    type,
    xp,
  }: {
    attributes: IAttributes;
    cooldown: number;
    currentActivityState: ActivityState;
    equipmentSlots?: HumanoidBody;
    hp: HP;
    items: Item[];
    level: number;
    position: Position;
    symbol: string;
    target?: Creature | Player;
    type: EntityType;
    xp?: number;
  }) {
    this.attributes = attributes;
    this.cooldown = cooldown;
    this.currentActivityState = currentActivityState;
    this.equipmentSlots = equipmentSlots;
    this.hp = hp;
    this.items = items;
    this.level = level;
    this.position = position;
    this.symbol = symbol;
    this.target = target;
    this.type = type;
    this.xp = xp;
  }

  isDead(): boolean {
    return this.currentActivityState === ActivityState.DEAD || this.hp.current <= 0;
  }
}
