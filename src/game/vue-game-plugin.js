import display from "./overview/Display";
import gData from "./state/data";
import GenerateName from "./utils/nameGenerator";
import gsMan from "./state/gsMan";
// import store from "../vuex/store";
// import CommandParser from "./Commands/CommandParser";

export default {
  install: Vue => {
    Vue.prototype.$game = {
      start() {
        gsMan.StartGame();
      },
      receiveInput(input) {
        console.log(input);
        gsMan.receiveInput(input);
      },
      parseCommand(command) {
        // return CommandParser.ParseCommand(command);
        console.log("Parsing " + command);
      },
      worldExists() {
        return gData.world !== null;
      },
      displaySplash() {
        return gData.displaySplash;
      },
      display: display,
    };
  },
};
