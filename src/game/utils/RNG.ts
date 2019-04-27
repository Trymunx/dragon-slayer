export default function RNG(min?: number, max?: number): number {
  let result: number;

  if (min && max) {
    result = Math.random() * (max - min) + min;
  } else if (min) {
    result = Math.random() * min;
  } else {
    result = Math.random();
  }

  return result;
}
