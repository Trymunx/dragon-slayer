// This takes an attack chance and a dodge chance, and assumes they are 0-1 inclusive.
export const attackSuccessChance = (ac: number, dc: number): number => ac - (ac * dc) / 4;

// Returns maxmimum possible damage given damage and armour args.
// The maximum is limited between 1 and the damage arg inclusive.
export const maxDamage = (dmg: number, arm: number): number => {
  const value = 0.8 * (dmg ** 4 / arm) ** 0.3;
  return Math.max(1, Math.min(dmg, value));
};
