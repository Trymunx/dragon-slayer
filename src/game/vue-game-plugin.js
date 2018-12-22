import gsMan from "./state/gsMan";
import gData from "./state/data";
// import CommandParser from "./Commands/CommandParser";
import GenerateName from "./Generators/NameGenerator";
import display from "./overview/Display";

export default {
  install: (Vue) => {
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
      displaySplash() {
        return gData.displaySplash;
      },
      display: display,
    }
  }
}
