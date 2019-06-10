// export type Position = [number, number];

export default class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  key(): string {
    return [this.x, this.y].join();
  }
}

export const getRandomPosInChunk = (chunkSize: number, left: number, top: number): Position =>
  new Position(
    Math.floor(Math.random() * chunkSize) + left * chunkSize,
    Math.floor(Math.random() * chunkSize) + top * chunkSize
  );
