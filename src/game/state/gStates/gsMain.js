import display from "../../overview/Display";
import displayConf from "../../config/display";
import gameloop from "../../gameloop";
import GameState from "../GameState";
import gsMan from "../gsMan";
// import gData from "../data";
import store from "../../../vuex/store";
import World from "../../world/World";

var gsMain = new GameState("main");

gsMain.init = () => {
  display.clear();
  display.setOptions(displayConf.main);

  store.dispatch("setWorld", new World());

  // Resize only after resetting font size to default
  let overviewDiv = document.querySelector("#overview");
  let [width, height] = display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);
  display.setOptions({
    width: width,
    height: height,
  });

  display.drawText(0, 0, "Main state initialised");
  display.drawText(2, 2, "Player: " + store.getters.playerName);

  display.drawWorld();

  store.dispatch("addMessage", {
    entity: "",
    message:
      "You find yourself in the middle of a forest. Looking around, you see trees extending off " +
      "into the distance.",
  });
  store.dispatch("addMessage", {
    entity: "Controls:",
    message:
      "Use the arrow keys to move around. Aditionally, you can press 'enter' to enter command " +
      "mode, where you can type commands to interact with the world. Try entering /help " +
      "in this mode for a list of commands. You can press 'escape' to unfocus the command input " +
      "to use arrow keys to move around.",
  });

  gameloop.run();
};

gsMain.keyDown = input => {
  if (store.getters.instantMode) {
    // Handle as an instant command
    switch (input) {
      case "ArrowUp":
      case "w":
        store.dispatch("movePlayer", "UP");
        display.drawWorld();
        break;
      case "ArrowDown":
      case "s":
        store.dispatch("movePlayer", "DOWN");
        display.drawWorld();
        break;
      case "ArrowLeft":
      case "a":
        store.dispatch("movePlayer", "LEFT");
        display.drawWorld();
        break;
      case "ArrowRight":
      case "d":
        store.dispatch("movePlayer", "RIGHT");
        display.drawWorld();
        break;
      default:
        break;
    }
    store.dispatch("highlight");
  }
};
gsMain.receiveInputText = input => {
  if (!store.getters.instantMode) {
    if (/^\/help$/.test(input)) {
      store.dispatch("addMessage", {
        entity: "Help",
        message:
          "Press 'enter' to enter typed command mode, and 'escape' to get back to command mode.\n" +
          "You can right-click on the map to see what is on that tile.",
      });
    } else {
      // Handle as text command
      store.dispatch("addMessage", {
        entity: "Main state",
        message: "Response to " + input,
      });
    }
  }
};

export default gsMain;
