import GS_Start from "./GS_Start";
import GS_Main from "./GS_Main";

class GameStateManager {
  constructor() {
    this.state = null;
  }

  get currentState() {
    return this.state;
  }

  set currentState(state) {
    this.state = state;
  }

  StartGame() {
    this.currentState = GS_Start;
    // GS_Start.init();
    this.state.init();
  }

  receiveInput(input) {
    if (this.state) {
      this.state.receiveInput(input);
    }
  }

  nextState(caller, player) {
    switch (caller) {
      case "start":
        this.currentState = GS_Main;
        break;
      case "main":
        break;
      case "end":
        this.currentState = GS_Start;
        break;
      default:
        console.error(`${caller} is not a registered game state.`);
    }
    this.state.setPlayer(player);
    this.state.init();
  }
}

let GS_Manager = new GameStateManager();

export default GS_Manager;
