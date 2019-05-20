export default function parseDirection(direction) {
  if (typeof direction !== "string") {
    return console.error("Arg must be a string");
  }

  let dir = [0, 0];

  switch (direction.toUpperCase()) {
    case "NORTH":
    case "U":
    case "UP":
      dir[1] = 1;
      break;

    case "SOUTH":
    case "D":
    case "DOWN":
      dir[1] = -1;
      break;

    case "WEST":
    case "L":
    case "LEFT":
      dir[0] = -1;
      break;

    case "EAST":
    case "R":
    case "RIGHT":
      dir[0] = 1;
      break;

    default:
      console.error(`${direction} is not a valid direction.`);
  }

  return dir;
}
