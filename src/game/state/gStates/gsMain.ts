import * as Parser from "../../commands/parser";
import { display } from "../../overview/Display";
import displayConf from "../../config/display.json";
import gameloop from "../../gameloop";
import { GameState } from "../GameState";
import { gsMan } from "../gsMan";
import store from "../../../vuex/store";
import World from "../../world/World";

export class MainGameState extends GameState {
  constructor() {
    super("main");
  }

  init(): void {
    display.clear();
    display.setOptions(displayConf.main);

    store.dispatch("setWorld", new World());

    // Resize only after resetting font size to default
    const overviewDiv = document.querySelector("#overview");

    // Don't continue running if div doesn't exist
    if (!overviewDiv) {
      console.error("Overview div not found (css selector #overview)");
      return;
    }

    const { width: divWidth, height: divHeight } = overviewDiv.getBoundingClientRect();
    const [width, height] = display.computeSize(divWidth, divHeight);
    display.setOptions({
      height: height,
      width: width,
    });

    display.drawText(0, 0, "Main state initialised");
    display.drawText(2, 2, "Player: " + store.getters.playerName);

    display.drawWorld();

    store.dispatch("addMessage", {
      entity: "",
      message:
        "You find yourself in the middle of a forest. Looking around, you see trees extending " +
        "off into the distance.",
    });
    store.dispatch("addMessage", {
      entity: "Controls:",
      message:
        "Use the arrow keys to move around. Additionally, you can press 'enter' to enter command " +
        "mode, where you can type commands to interact with the world. Try entering /help " +
        "in this mode for a list of commands. You can press 'escape' to unfocus the command " +
        "input to use arrow keys to move around.",
    });

    gameloop.run();
  }

  redraw(): void {
    display.drawWorld();
  }

  keyDown(input: string) {
    if (store.getters.instantMode) {
      // Handle as an instant command
      switch (input) {
        case "ArrowUp":
        case "w":
          store.dispatch("movePlayer", "north");
          display.drawWorld();
          break;
        case "ArrowDown":
        case "s":
          store.dispatch("movePlayer", "south");
          display.drawWorld();
          break;
        case "ArrowLeft":
        case "a":
          store.dispatch("movePlayer", "west");
          display.drawWorld();
          break;
        case "ArrowRight":
        case "d":
          store.dispatch("movePlayer", "east");
          display.drawWorld();
          break;
        default:
          break;
      }
      store.dispatch("highlight");
    }
  }

  keyUp(input: string) {
    if (store.getters.instantMode) {
      // do nothing
    }
  }

  receiveInputText(input: string) {
    if (!store.getters.instantMode) {
      const result = Parser.parse(input);

      console.log(result);
    }
  }
}

export const gsMain = new MainGameState();
