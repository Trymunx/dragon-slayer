import gsStart from "./gStates/gsStart";
import gsMain from "./gStates/gsMain";
import gData from "./data";

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
    this.currentState = gsStart;
    this.state.init();
  }

  receiveInput(input) {
    if (this.state) {
      this.state.receiveInput(input);
    }
  }

  redraw() {
    if (this.state && this.state.redraw) {
      this.state.redraw();
    }
  }

  nextState(caller) {
    switch (caller) {
      case "start":
        this.currentState = gsMain;
        break;
      case "main":
        break;
      case "end":
        this.currentState = gsStart;
        break;
      default:
        console.error(`${caller} is not a registered game state.`);
    }
    this.state.init();
  }
}

let gsMan = new GameStateManager();

export default gsMan;
