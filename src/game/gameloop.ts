import { ActivityState } from "./entities/entity";
import { Creature } from "./entities/creatures";
import { display } from "./overview/Display";
import store from "../vuex/store";

const gameloop = {
  run: () => {
    if (store.getters.gamePaused) {
      display.drawPaused();
      window.requestAnimationFrame(gameloop.run);
      return;
    }

    const player = store.getters.player;
    const playerPos = store.getters.playerPos;

    const locationsToCreaturesMap: Record<string, Creature[]> = getCreaturesToUpdate(playerPos);
    for (const [location, creatures] of Object.entries(locationsToCreaturesMap)) {
      const idleAggressive: Creature[] = creatures.filter(
        (creature: Creature) =>
          creature.aggressive && creature.currentActivityState === ActivityState.MOVING
      );

      // Attack player
      if (location === store.getters.playerPos.key) {
        idleAggressive.forEach(aggressiveCreature => aggressiveCreature.targetPlayer(player));
      }

      // Fight other creatures
      if (idleAggressive.length > 1 && creatures.length > 1) {
        idleAggressive.forEach(aggressiveCreature => aggressiveCreature.targetCreatures(creatures));
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
