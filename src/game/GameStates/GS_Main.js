import display from "../overview/Display";
import store from "../../vuex/store";
import GameStateManager from "./GameStateManager";
import GameState from "./GameState";
import displayConf from "../config/display";
import World from "../Generators/world/World";

var GS_Main = new GameState("main", false);

GS_Main.init = function() {
  display.clear();
  display.setOptions(displayConf.main);

  let world = new World();
  console.log(world);

  // Resize only after resetting font size to default
  let overviewDiv = document.querySelector("#overview");
  let [width, height] = display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);
  display.setOptions({
    width: width,
    height: height
  });

  display.drawText(0, 0, "Main state initialised");
  display.drawText(2, 2, "Player: " + this.player.name);

  display.drawWorld(world, {x: 0, y: 0});

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

GS_Main.setPlayer = function(player) {
  this.player = player;
}

GS_Main.receiveInput = function(input) {
  if (store.getters.instantMode) {
    // Handle as an instant command
  } else {
    // Handle as text command
    store.dispatch("addMessage", {
      entity: "Main state",
      message: "Response to " + input
    });
  }
}

export default GS_Main;
