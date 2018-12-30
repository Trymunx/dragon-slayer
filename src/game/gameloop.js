import ROT from "rot-js";
import store from "../vuex/store";
import display from "./overview/Display";

const scheduler = new ROT.Scheduler.Action();

const gameloop = {
  start: () => {
    /* generate some actors */
    Object.keys(store.getters.creatures).forEach(key => {
      store.getters.creatures[key].forEach(c => scheduler.add(c, true));
    });
    // for (var i=0;i<4;i++) {
    //       scheduler.add(i+1, true, i); /* last argument - initial delay */
    // }
    window.requestAnimationFrame(gameloop.run);
  },
  run: () => {
    /* simulate several turns */
    // var template = "Actor %s performing action for %s time units (current time: %s)";
    // for (let i=0;i<200;i++) {
      let current = scheduler.next();

      // let actionDuration = Math.ceil(ROT.RNG.getUniform() * 20);
      scheduler.setDuration(current.speed());
      // console.log(`moving ${current.name} at ${current.pos} with speed ${current.speed()}`);
      current.move();
      display.drawWorld();
      // var padded = actionDuration.toString().padStart(2, "0");
      // SHOW(ROT.Util.format(template, current, padded, scheduler.getTime()))
    // }
    window.requestAnimationFrame(gameloop.run);
  },
}

export default gameloop;
