export default function RNG (...args) {
  let result = 0;

  if (args.length > 2) {
    console.error("Too many arguments. First two arguments used.");
  }

  if (args[0] && args[1]) {
    result = Math.random() * (args[1] - args[0]) + args[0];
  } else if (args[0]) {
    result = Math.random() * args[0];
  } else {
    result = Math.random();
  }

  return result;
}