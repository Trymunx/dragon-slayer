import GameStateManager from "./GameStates/GameStateManager";
import CommandParser from "./Commands/CommandParser";

export default {
  install: (Vue) => {
    Vue.prototype.$game = {
      startGame() {
        GameStateManager.StartGame();
      },
      parseCommand(command) {
        CommandParser.ParseCommand(command);
      }
    }
  }
}