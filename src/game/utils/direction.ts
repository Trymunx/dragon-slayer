import Position from "../world/position";

export enum Direction {
  NORTH = "north",
  SOUTH = "south",
  EAST = "east",
  WEST = "west",
}

export function parseDir(direction: Direction): Position {
  let dir: Position = new Position(0, 0);

  switch (direction) {
    case Direction.NORTH:
      dir.y = 1;
      break;

    case Direction.SOUTH:
      dir.y = -1;
      break;

    case Direction.WEST:
      dir.x = -1;
      break;

    case Direction.EAST:
      dir.x = 1;
      break;

    default:
      console.error(`${direction} is not a valid direction.`);
  }

  return dir;
}

export function getDirFromVector(x: number, y: number): string {
  let dir = [];
  if (y < 0) dir.push("north");
  else if (y > 0) dir.push("south");
  if (x < 0) dir.push("west");
  else if (x > 0) dir.push("east");
  if (!x && !y) dir.push("here");
  return dir.join(" ");
}
