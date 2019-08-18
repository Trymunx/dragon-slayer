enum ItemType {
  Craftable,
  Food,
  Ingredient,
  Trophy,
}

interface Item {
  components: ItemType[];
  name: string;
  value: number;
}
