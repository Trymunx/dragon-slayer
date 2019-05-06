import gsMain from "./gStates/gsMain";
import gsStart from "./gStates/gsStart";
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

  receiveInputKeyUp(input) {
    if (this.state && this.state.keyUp) {
      this.state.keyUp(input);
    }
  }
  receiveInputKeyDown(input) {
    if (this.state && this.state.keyDown) {
      this.state.keyDown(input);
    }
  }
  receiveInputText(text) {
    console.log(text);
    if (this.state && this.state.receiveInputText) {
      this.state.receiveInputText(text);
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
