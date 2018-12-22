import display from "../../overview/Display";
import store from "../../../vuex/store";
import gsMan from "../gsMan";
import GameState from "../GameState";
import gData from "../data";
import displayConf from "../../config/display";
import World from "../../Generators/world/World";

var gsMain = new GameState("main");

gsMain.init = () => {
  this.display = display;
  this.display.clear();
  this.display.setOptions(displayConf.main);

  gData.world = new World();

  // Resize only after resetting font size to default
  let overviewDiv = document.querySelector("#overview");
  let [width, height] = this.display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);
  this.display.setOptions({
    width: width,
    height: height
  });

  this.display.drawText(0, 0, "Main state initialised");
  this.display.drawText(2, 2, "Player: " + gData.player.name);

  this.display.drawWorld();

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

gsMain.receiveInput = input => {
  if (store.getters.instantMode) {
    // Handle as an instant command
    switch (input) {
      case "ArrowUp":
        gData.player.pos.y--;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld();
        break;
      case "ArrowDown":
        gData.player.pos.y++;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld();
        break;
      case "ArrowLeft":
        gData.player.pos.x--;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld();
        break;
      case "ArrowRight":
        gData.player.pos.x++;
        this.display.setOptions(displayConf.main)
        this.display.drawWorld();
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

export default gsMain;
