import display from "../../overview/Display";
import store from "../../../vuex/store";
import gsMan from "../gsMan";
import GameState from "../GameState";
// import gData from "../data";
import displayConf from "../../config/display";
import World from "../../Generators/world/World";
import gameloop from "../../gameloop";

var gsMain = new GameState("main");

gsMain.init = () => {
  display.clear();
  display.setOptions(displayConf.main);

  store.dispatch('setWorld', new World());

  // Resize only after resetting font size to default
  let overviewDiv = document.querySelector("#overview");
  let [width, height] = display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);
  display.setOptions({
    width: width,
    height: height
  });

  display.drawText(0, 0, "Main state initialised");
  display.drawText(2, 2, "Player: " + store.getters.playerName);

  display.drawWorld();

  store.dispatch("addMessage", {
    entity: "",
    message: "You find yourself in the middle of a forest. Looking around, you see trees extending off into the distance."
  });
  store.dispatch("addMessage", {
    entity: "Controls:",
    message: "You can type commands to move around and interact with the world. Try entering /help for a list of commands. " + 
      "Additionally, you can press 'escape' to unfocus the command input and then use arrow keys to move around. Press 'enter' to refocus the command input."
  });


  gameloop.start();
}

gsMain.receiveInput = input => {
  if (store.getters.instantMode) {
    // Handle as an instant command
    switch (input) {
      case "ArrowUp":
        store.dispatch("movePlayer", "UP");
        display.drawWorld();
        break;
      case "ArrowDown":
        store.dispatch("movePlayer", "DOWN");
        display.drawWorld();
        break;
      case "ArrowLeft":
        store.dispatch("movePlayer", "LEFT");
        display.drawWorld();
        break;
      case "ArrowRight":
        store.dispatch("movePlayer", "RIGHT");
        display.drawWorld();
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
