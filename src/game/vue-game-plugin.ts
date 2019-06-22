import { display } from "./overview/Display";
import gData from "./state/data";
import { gsMan } from "./state/gsMan";
import { Display } from "rot-js";
// import PluginFunction from "vue/types";
import _Vue from "vue";
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
    start() {
      gsMan.StartGame();
    },
    receiveInputKeyUp(input) {
      gsMan.receiveInputKeyUp(input);
    },
    receiveInputKeyDown(input) {
      gsMan.receiveInputKeyDown(input);
    },
    receiveInputText(text) {
      gsMan.receiveInputText(text);
    },
    parseCommand(command) {
      // return CommandParser.ParseCommand(command);
      console.log("Parsing " + command);
    },
    worldExists() {
      return gData.world !== null;
    },
    displaySplash() {
      return gData.displaySplash;
    },
    display: display,
  } as gamePlugin;
}
