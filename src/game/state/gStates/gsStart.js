import display from "../../overview/Display";
import displayConf from "../../config/display";
import GameState from "../GameState";
import generateName from "../../utils/nameGenerator";
import gsMan from "../gsMan";
// import gData from "../data";
import newPlayer from "../../entities/player";
import store from "../../../vuex/store";

var gsStart = new GameState("start");

gsStart.init = function() {
  display.setOptions(displayConf.start);
  display.draw(4, 1, "Trymunx's", "#8a8c89");
  display.draw(4, 2, "Dragon Slayer", "#086623");

  store.dispatch("addMessage", {
    entity: "Welcome",
    message:
      "Greetings adventurer. Please enter your name to begin, or type /generate to have one " +
      "generated for you.",
  });
};

gsStart.keyDown = null;

gsStart.receiveInputText = function(input) {
  if (!this.playerName) {
    this.confirmPlayerName(input);
  } else {
    switch (input.toUpperCase()) {
      case "YES":
      case "Y":
        store.dispatch("setPlayer", newPlayer(this.playerName));
        store.dispatch("setSplash", false);
        gsMan.nextState(this.name);
        break;
      case "NO":
      case "N":
        this.playerName = null;
        store.dispatch("setPlayerName", null);
        store.dispatch("addMessage", {
          entity: "Game",
          message: "Please enter a name, or type /generate to have one generated for you.",
        });
        break;
      case "/GEN":
      case "/GENERATE":
        this.confirmPlayerName("/gen");
        break;
      default:
        this.confirmPlayerName(this.playerName);
    }
  }
};

gsStart.confirmPlayerName = function(input) {
  switch (input) {
    case "/gen":
    case "/generate":
      input = generateName();
    // break omitted
    default:
      this.playerName = input;
      store.dispatch("setPlayerName", input);
      store.dispatch("addMessage", {
        entity: "Confirm name:",
        message: `Your name is ${input}. Use this name? [yes/no]`,
      });
  }
};

export default gsStart;
