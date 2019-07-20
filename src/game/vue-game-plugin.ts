import _Vue from "vue";
import { gsMan } from "./state/gsMan";
import { display, Display } from "./overview/Display";
// import PluginFunction from "vue/types";
// import store from "../vuex/store";
// import CommandParser from "./Commands/CommandParser";

export interface gamePlugin {
  start: () => void;
  receiveInputKeyUp: (input: string) => void;
  receiveInputKeyDown: (input: string) => void;
  receiveInputText: (text: string) => void;
  parseCommand: (command: string) => void;
  worldExists: () => boolean;
  displaySplash: () => void;
  display: Display;
}

export default function install<T>(Vue: typeof _Vue, options?: T): void {
  Vue.prototype.$game = {
    display: display,
    parseCommand(command) {
      // return CommandParser.ParseCommand(command);
      console.log("Parsing " + command);
    },
    receiveInputKeyDown(input) {
      gsMan.receiveInputKeyDown(input);
    },
    receiveInputKeyUp(input) {
      gsMan.receiveInputKeyUp(input);
    },
    receiveInputText(text) {
      gsMan.receiveInputText(text);
    },
    start() {
      gsMan.StartGame();
    },
  } as gamePlugin;
}
