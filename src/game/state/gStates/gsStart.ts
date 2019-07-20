import { display } from "../../overview/Display";
import displayConf from "../../config/display.json";
import { GameState } from "../GameState";
import generateName from "../../utils/nameGenerator";
import { gsMan } from "../gsMan";
import { Player } from "../../entities/player";
import store from "../../../vuex/store";

export class StartGameState extends GameState {
  playerName: string;

  constructor() {
    super("start");
    this.playerName = "";
  }

  init(): void {
    display.setOptions(displayConf.start);
    display.draw(4, 1, "Trymunx's", "#8a8c89", null);
    display.draw(4, 2, "Dragon Slayer", "#086623", null);

    store.dispatch("addMessage", {
      entity: "Welcome",
      message:
        "Greetings adventurer. Please enter your name to begin, or type /generate to have one " +
        "generated for you.",
    });
  }

  receiveInputText(input: string): void {
    if (this.playerName === "") {
      this.confirmPlayerName(input);
    } else {
      switch (input.toUpperCase()) {
        case "YES":
        case "Y":
          store.dispatch("setPlayer", new Player(this.playerName));
          store.dispatch("setSplash", false);
          gsMan.nextState(this);
          break;
        case "NO":
        case "N":
          this.playerName = "";
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
  }

  redraw(): void {
    display.setOptions(displayConf.start);
    display.draw(4, 1, "Trymunx's", "#8a8c89", null);
    display.draw(4, 2, "Dragon Slayer", "#086623", null);
  }

  confirmPlayerName(input: string): void {
    if (/^gen$/.test(input) || /^generate$/.test(input)) {
      input = generateName();
    }
    this.playerName = input;
    store.dispatch("setPlayerName", input);
    store.dispatch("addMessage", {
      entity: "Confirm name:",
      message: `Your name is ${input}. Use this name? [yes/no]`,
    });
  }
}

export const gsStart = new StartGameState();
