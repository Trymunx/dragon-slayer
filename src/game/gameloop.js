import display from "./overview/Display";
import store from "../vuex/store";

const gameloop = {
  run: () => {
    const creatures = getCreaturesToUpdate();
    Object.keys(creatures).forEach(key => {
      creatures[key].update();
    });
    display.drawWorld();
    window.requestAnimationFrame(gameloop.run);
  },
};

function getCreaturesToUpdate() {
  const dOpts = display.getOptions();
  const radius = Math.max(dOpts.width, dOpts.height);

  const playerPos = store.getters.playerPos;
  if (!playerPos) console.error("No player position in game loop");

  return store.getters.creaturesWithinRadius(playerPos, radius);
}

export default gameloop;
