import display from "../overview/Display";
import store from "../../vuex/store";
import GameStateManager from "./GameStateManager";
import GameState from "./GameState";
import displayConf from "../config/display";
import World from "../Generators/world/World";

var GS_Main = new GameState("main", false);

GS_Main.init = () => {
  this.display = display;
  this.display.clear();
  this.display.setOptions(displayConf.main);

  this.world = new World();
  console.log(this.world);

  // Resize only after resetting font size to default
  let overviewDiv = document.querySelector("#overview");
  let [width, height] = this.display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);
  this.display.setOptions({
    width: width,
    height: height
  });

  this.display.drawText(0, 0, "Main state initialised");
  this.display.drawText(2, 2, "Player: " + this.player.name);

  this.display.drawWorld(this.world, this.player.pos);

  store.dispatch("addMessage", {
    entity: "",
    message: "You find yourself in the middle of a forest. Looking around, you see trees extending off into the distance."
  });
  store.dispatch("addMessage", {
    entity: "Controls:",
    message: "You can type commands to move around and interact with the world. Try entering /help for a list of commands. " + 
      "Additionally, you can press 'escape' to unfocus the command input and then use arrow keys to move around. Press 'enter' to refocus the command input."
  });
}

GS_Main.setPlayer = player => {
  this.player = player;
}

GS_Main.receiveInput = input => {
  if (store.getters.instantMode) {
    // Handle as an instant command
    switch (input) {
      case "ArrowUp":
        this.player.pos.y--;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld(this.world, this.player.pos);
        break;
      case "ArrowDown":
        this.player.pos.y++;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld(this.world, this.player.pos);
        break;
      case "ArrowLeft":
        this.player.pos.x--;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld(this.world, this.player.pos);
        break;
      case "ArrowRight":
        this.player.pos.x++;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld(this.world, this.player.pos);
        break;
      default:
        break;
    }
  } else {
    // Handle as text command
    store.dispatch("addMessage", {
      entity: "Main state",
      message: "Response to " + input
    });
  }
}

GS_Main.redraw = () => this.display.drawWorld(this.world, this.player.pos);

export default GS_Main;
