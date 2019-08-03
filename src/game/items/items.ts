enum ItemType {
  Craftable,
  Food,
  Ingredient,
  Trophy,
}

export type Gold = { amount: number };

interface Item {
  components: ItemType[];
  name: string;
  value: number;
}
