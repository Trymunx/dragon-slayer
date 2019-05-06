export default function parseDirection(direction) {
  if (typeof direction !== "string") {
    return console.error("Arg must be a string");
  }

  let x = 0,
    y = 0;

  switch (direction.toUpperCase()) {
    case "NORTH":
    case "U":
    case "UP":
      y = 1;
      break;

    case "SOUTH":
    case "D":
    case "DOWN":
      y = -1;
      break;

    case "WEST":
    case "L":
    case "LEFT":
      x = -1;
      break;

    case "EAST":
    case "R":
    case "RIGHT":
      x = 1;
      break;

    default:
      console.error(`${direction} is not a valid direction.`);
  }

  return { x, y };
}
