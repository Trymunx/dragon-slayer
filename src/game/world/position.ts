// export type Position = [number, number];

export default class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get key(): string {
    return [this.x, this.y].join();
  }
}

export const getRandomPosInChunk = (chunkSize: number, left: number, top: number): Position =>
  new Position(
    Math.floor(Math.random() * chunkSize) + left * chunkSize,
    Math.floor(Math.random() * chunkSize) + top * chunkSize
  );

export type Vector = [number, number];

// Converts a vector into a string separated by a comma to be used as a key.
// If using a number[] only the first two values are used, intended only to be
// used where Vector isn't imported for casting but the array is of length 1.
export const VTS = (x: number, y: number): string => `${x},${y}`;
