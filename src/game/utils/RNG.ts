export function RNG(min?: number, max?: number): number {
  if (min !== undefined && max !== undefined) {
    return Math.random() * (max - min) + min;
  } else if (min !== undefined) {
    return Math.random() * min;
  } else {
    return Math.random();
  }
}
