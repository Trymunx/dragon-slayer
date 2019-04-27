import gsMan from "./state/gsMan";
// import store from "../vuex/store";
import gData from "./state/data";
// import CommandParser from "./Commands/CommandParser";
import GenerateName from "./utils/nameGenerator";
import display from "./overview/Display";

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
