import { Item } from "../../types";

type WeaponSlot = "hand";

export interface IWeapon extends Item {
  attackChance: number;
  attackSpeed: number;
  damage: number;
  slots: WeaponSlot[];
}

export const dagger: IWeapon = {
  attackChance: 0.4,
  attackSpeed: 1.5,
  damage: 14,
  name: "dagger",
  plural: "daggers",
  slots: ["hand"],
  val: 20,
};

export const claymore: IWeapon = {
  attackChance: 0.6,
  attackSpeed: 0.7,
  damage: 24,
  name: "claymore",
  plural: "claymores",
  slots: ["hand", "hand"],
  val: 20,
};
