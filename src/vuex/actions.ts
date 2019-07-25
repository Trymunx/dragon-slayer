import { ActionContext, ActionTree } from "vuex";
import { Creature } from "../game/entities/creatures";
import { Item } from "../types";
import { Player } from "../game/entities/player";
import Position from "../game/world/position";
import store from "./store";
import World from "../game/world/World";
import { Direction, parseDir } from "../game/utils/direction";

function actionGen<P>(name: string) {
  return (payload: P) => store.dispatch(name, payload);
}

// To use, import dispatchAction then e.g. dispatchAction.SetPlayerName("new name"))
export const dispatchAction = {
  AddCreature: actionGen<Creature>("addCreature"),
  AddMessage: actionGen<{ entity: string; message: string }>("addMessage"),
  AddMessageAtPosition: actionGen<{ entity: string; message: string; position: Position }>(
    "addMessageAtPosition"
  ),
  ClearHighlight: actionGen<null>("clearHighlight"),
  DropItems: actionGen<{ items: Item[]; pos: Position }>("dropItems"),
  EnterCommand: actionGen<string>("enterCommand"),
  Highlight: actionGen<Record<string, {} | { colour: string; symbol: string }>>("highlight"),
  MoveCreature: actionGen<{ creature: Creature; newPos: Position }>("moveCreature"),
  MovePlayer: actionGen<Direction>("movePlayer"),
  ParseCommand: actionGen<string>("parseCommand"),
  SetCommandMode: actionGen<string>("setCommandMode"),
  SetDisplayOrigin: actionGen<[number, number]>("setDisplayOrigin"),
  SetInputText: actionGen<string>("setInputText"),
  SetPlayer: actionGen<Player>("setPlayer"),
  SetPlayerName: actionGen<string>("setPlayerName"),
  SetSplash: actionGen<boolean>("setSplash"),
  SetWorld: actionGen<World>("setWorld"),
};

type VuexAction<P> = (context: ActionContext<any, any>, payload: P) => void;

interface IActions {
  addCreature: VuexAction<Creature>;
  addMessage: VuexAction<{ entity: string; message: string }>;
  addMessageAtPosition: VuexAction<{ entity: string; message: string; position: Position }>;
  clearHighlight: VuexAction<null>;
  dropItems: VuexAction<{ items: Item[]; pos: Position }>;
  enterCommand: VuexAction<string>;
  highlight: VuexAction<Record<string, {} | { colour: string; symbol: string }>>;
  moveCreature: VuexAction<{ creature: Creature; newPos: Position }>;
  movePlayer: VuexAction<Direction>;
  parseCommand: VuexAction<string>;
  setCommandMode: VuexAction<string>;
  setDisplayOrigin: VuexAction<[number, number]>;
  setInputText: VuexAction<string>;
  setPlayer: VuexAction<Player>;
  setPlayerName: VuexAction<string>;
  setSplash: VuexAction<boolean>;
  setWorld: VuexAction<World>;
}

export const actions: IActions = {
  addCreature({ commit }, creature) {
    commit("ADD_CREATURE", creature);
  },
  addMessage({ commit }, data) {
    commit("ADD_MESSAGE", data);
  },
  addMessageAtPosition({ commit, state }, { entity, message, position }) {
    // Only send messages when player is there
    if (state.player.position.x === position.x && state.player.position.y === position.y) {
      commit("ADD_MESSAGE", { entity, message });
    }
  },
  clearHighlight({ commit }) {
    commit("CLEAR_HIGHLIGHTED");
  },
  dropItems({ commit }, data) {
    commit("DROP_ITEMS", data);
  },
  enterCommand({ commit, state }, text) {
    commit("ADD_MESSAGE", {
      entity: state.player.name,
      message: text,
    });
    commit("SET_INPUT_TEXT", "");
  },
  highlight({ commit }, tiles) {
    commit("HIGHLIGHT_TILES", tiles);
  },
  moveCreature({ commit }, { creature, newPos }: { creature: Creature; newPos: Position }) {
    commit("MOVE_CREATURE", { creature, newPos });
  },
  movePlayer({ commit }, dir: Direction) {
    commit("MOVE_PLAYER", parseDir(dir));
  },
  parseCommand(_, command) {
    console.log("Parsing", command);
  },
  // receiveInput({ commit }, input) {
  // gsMan.receiveInput(input);
  // },
  setCommandMode({ commit }, mode) {
    commit("SET_COMMAND_MODE", mode);
  },
  setDisplayOrigin({ commit }, vector) {
    commit("SET_DISPLAY_ORIGIN", vector);
  },
  setInputText({ commit }, text) {
    commit("SET_INPUT_TEXT", text);
  },
  setPlayer({ commit }, player) {
    commit("SET_PLAYER", player);
  },
  setPlayerName({ commit }, name) {
    commit("SET_PLAYER_NAME", name);
  },
  setSplash({ commit }, val) {
    commit("SET_SPLASH", val);
  },
  setWorld({ commit }, world) {
    commit("SET_WORLD", world);
  },
};
