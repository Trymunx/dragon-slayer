import GameStateManager from "./GameStates/GameStateManager";
// import CommandParser from "./Commands/CommandParser";
import GenerateName from "./Generators/NameGenerator";
import display from "./overview/Display.js";

export default {
  install: (Vue) => {
    Vue.prototype.$game = {
      start() {
        GameStateManager.StartGame();
      },
      receiveInput(input) {
        console.log(input);
        GameStateManager.receiveInput(input);
      },
      generateName() {
        return GenerateName();
      },
      parseCommand(command) {
        // return CommandParser.ParseCommand(command);
        console.log("Parsing " + command);
      },
      getCurrentState() {
        return GameStateManager.currentState;
      },
      redraw() {
        return GameStateManager.redraw();
      },
      display: display,
    }
  }
}
