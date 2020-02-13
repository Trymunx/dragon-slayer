// enum ItemType {
//   Craftable,
//   Food,
//   Ingredient,
//   Trophy,
// }

type GenericItem = {
  definitionID: number;
  name: string;
  value: number;
}

type WeaponSlotName = "hand";
type ArmourSlotName =
  | "head"
  | "neck"
  | "torso"
  | "back"
  | "wrist"
  | "hand"
  | "finger"
  | "waist"
  | "legs"
  | "feet";
export type EquipmentSlotName = WeaponSlotName | ArmourSlotName;

type WeaponItem = GenericItem & {
  attackChange: number;
  attackSpeed: number;
  damage: number;
  slots: WeaponSlotName[];
}

type ArmourItem = GenericItem & {
  armour: number;
  dodgeChange: number;
  slots: ArmourSlotName[];
}

type FoodItem = GenericItem & {
  cookTime: number;
  healValueCooked: number;
  healValueRaw: number;
}

enum PotionCategory {
  Health,
  Strength,
  Fortifying
}

type PotionItem = GenericItem & {
  category: PotionCategory;
  effectValue: number; // amount of e.g. healing/Strength/Fortifying the potion does.
}

type ItemDefinition = {};

type ItemDefinitionsMap = Map<number, ItemDefinition>;

type Item = {
  // components: ItemType[];
  id: number;
  name: string;
  templates: Array<keyof ItemDefinitionsMap>;
  value: number; // memoised sum of template values
}

// This is all of the items in the game. It is a map from the itemID to the item.
type AllGameItems = Map<number, Item>;
