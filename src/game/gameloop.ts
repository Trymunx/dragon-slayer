import { Creature } from "./entities/creatures";
import { display } from "./overview/Display";
import store from "../vuex/store";

const gameloop = {
  run: () => {
    const player = store.getters.player;
    const playerPos = store.getters.playerPos;

    const locationsToCreaturesMap = getCreaturesToUpdate(playerPos);
    for (const [location, creatures] of locationsToCreaturesMap) {
      const aggressive: Creature[] = creatures.filter((creature: Creature) => creature.aggressive);

      // Attack player
      if (location === store.getters.playerPos.key()) {
        aggressive.forEach(aggressiveCreature => aggressiveCreature.targetPlayer(player));
      }

      // Fight other creatures
      if (aggressive.length > 1 && creatures.length > 1) {
        aggressive.forEach(aggressiveCreature => aggressiveCreature.targetCreatures(creatures));
      }

      // Update cooldown
      creatures.forEach((creature: Creature) => creature.update());
    }

    player.update();
    display.drawWorld();
    window.requestAnimationFrame(gameloop.run);
  },
};

function getCreaturesToUpdate(playerPos: Position) {
  const dOpts = display.getOptions();
  const radius = Math.max(dOpts.width, dOpts.height);

  if (!playerPos) console.error("No player position in game loop");

  return store.getters.creaturesWithinRadius(playerPos, radius);
}

export default gameloop;
