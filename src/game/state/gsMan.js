import gsStart from "./gStates/gsStart";
import gsMain from "./gStates/gsMain";
// import gData from "./data";
// import store from "../../vuex/store";

class GameStateManager {
  constructor() {
    this.state = null;
  }

  StartGame() {
    this.state = gsStart;
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
        this.state = gsMain;
        break;
      case "main":
        break;
      case "end":
        this.state = gsStart;
        break;
      default:
        console.error(`${caller} is not a registered game state.`);
    }
    this.state.init();
  }
}

let gsMan = new GameStateManager();

export default gsMan;
