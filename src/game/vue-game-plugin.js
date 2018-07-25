import GameStateManager from "./GameStates/GameStateManager";
// import CommandParser from "./Commands/CommandParser";
import GenerateName from "./Generators/NameGenerator";

export default {
  install: (Vue) => {
    Vue.prototype.$game = {
      startGame() {
        return GameStateManager.StartGame();
      },
      generateName() {
        return GenerateName();
      },
      parseCommand(command) {
        // return CommandParser.ParseCommand(command);
        console.log("Parsing " + command);
      }
    }
  }
}
