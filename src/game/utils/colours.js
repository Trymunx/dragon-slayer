import store from "../../vuex/store";

export function levelColour(level) {
  let diff = level - store.getters.player.level;
  let colour;
  if (diff > 10) {
    colour = "hsl(0, 100%, 50%)";
  } else if (diff < -10) {
    colour = "hsl(120, 100%, 50%)";
  } else {
    // converts numbers from 10 to -10 into a val from 120 to 0
    colour = `hsl(${120 - (diff + 10) * 6}, 100%, 50%)`;
  }
  return colour;
}
