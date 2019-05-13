import store from "../../vuex/store";

export function levelColour(level: number, brightness: number = 40): string {
  const diff: number = level - store.getters.player.level;
  let colour: string;
  if (diff > 10) {
    colour = `hsl(0, 100%, ${brightness}%)`;
  } else if (diff < -10) {
    colour = `hsl(120, 100%, ${brightness}%)`;
  } else {
    // converts numbers from 10 to -10 into a val from 120 to 0
    colour = `hsl(${120 - (diff + 10) * 6}, 100%, ${brightness}%)`;
  }
  return colour;
}
