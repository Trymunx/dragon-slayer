export enum Direction {
  NORTH = "north",
  SOUTH = "south",
  EAST = "east",
  WEST = "west",
}

export function parseDir(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.NORTH:
      return [0, -1];
    case Direction.SOUTH:
      return [0, 1];
    case Direction.WEST:
      return [-1, 0];
    case Direction.EAST:
      return [1, 0];
    default:
      console.error(`${direction} is not a valid direction.`);
  }
  return [0, 0];
}

export function getDirStringFromVector(x: number, y: number): string {
  let dir = [];
  if (y < 0) dir.push("north");
  else if (y > 0) dir.push("south");
  if (x < 0) dir.push("west");
  else if (x > 0) dir.push("east");
  if (!x && !y) dir.push("here");
  return dir.join(" ");
}

export const getRandomDirection = (): Direction => {
  const random = Math.floor(Math.random() * 4);

  if (random < 1) {
    return Direction.NORTH;
  } else if (random < 2) {
    return Direction.SOUTH;
  } else if (random < 3) {
    return Direction.EAST;
  } else {
    return Direction.WEST;
  }
};
