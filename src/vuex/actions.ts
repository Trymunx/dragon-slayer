import { Creature } from "../game/entities/creatures";
import { Item } from "../types";
import { Player } from "../game/entities/player";
import { Map as ROTMap } from "rot-js";
import { World } from "../game/world/World";
import { ActionContext, ActionTree, Store } from "vuex";
import { Direction, parseDir } from "../game/utils/direction";
import Position, { Vector } from "../game/world/position";
import store, { IState } from "./store";

function actionGen<P>(name: string) {
  return (payload?: P) => store.dispatch(name, payload);
}

// type dispatcher<I, A extends keyof I> = (payload?: I[A]) => void;

// To use, import dispatchAction then e.g. dispatchAction.SetPlayerName("new name"))
export const dispatchAction = {
  AddCreature: actionGen<Creature>("addCreature"),
  AddMessage: actionGen<{ entity: string; message: string }>("addMessage"),
  AddMessageAtPosition: actionGen<{ entity: string; message: string; position: Position }>(
    "addMessageAtPosition"
  ),
  ClearHighlight: actionGen<null>("clearHighlight"),
  DropItems: actionGen<{ gold: number; items: Item[]; pos: Position }>("dropItems"),
  EnterCommand: actionGen<string>("enterCommand"),
  Highlight: actionGen<Record<string, {} | { colour: string; symbol: string }>>("highlight"),
  MoveCreature: actionGen<{ creature: Creature; newPos: Vector }>("moveCreature"),
  MovePlayer: actionGen<Direction>("movePlayer"),
  ParseCommand: actionGen<string>("parseCommand"),
  SetCommandMode: actionGen<string>("setCommandMode"),
  SetDisplayOrigin: actionGen<[number, number]>("setDisplayOrigin"),
  SetDungeon: actionGen<number[][]>("setDungeon"),
  SetInputText: actionGen<string>("setInputText"),
  SetPlayer: actionGen<Player>("setPlayer"),
  SetPlayerName: actionGen<string>("setPlayerName"),
  SetSplash: actionGen<boolean>("setSplash"),
  SetWorld: actionGen<World>("setWorld"),
  ToggleDrawDungeon: actionGen<null>("toggleDrawDungeon"),
  TogglePaused: actionGen<null>("togglePaused"),
};

// type ActionKey = keyof IActions;

// type disp = {
//   [name: ActionKey]: (payload?: IActions[typeof name]) => void;
// }

// type VuexAction<S, R, P> = (context: ActionContext<S, R>, payload: P) => void;
type ActionHandlerWithPayload<S, R, P> = (
  this: Store<R>,
  intjectee: ActionContext<S, R>,
  payload: P
) => any;

interface IActions extends ActionTree<IState, IState> {
  addCreature: ActionHandlerWithPayload<IState, IState, Creature>;
  addMessage: ActionHandlerWithPayload<
    IState,
    IState,
    { entity: string; message: string }
  >;
  addMessageAtPosition: ActionHandlerWithPayload<
    IState,
    IState,
    { entity: string; message: string; position: Position }
  >;
  clearHighlight: ActionHandlerWithPayload<IState, IState, null>;
  dropItems: ActionHandlerWithPayload<IState, IState, { items: Item[]; pos: Position }>;
  enterCommand: ActionHandlerWithPayload<IState, IState, string>;
  highlight: ActionHandlerWithPayload<
    IState,
    IState,
    Record<string, {} | { colour: string; symbol: string }>
  >;
  moveCreature: ActionHandlerWithPayload<
    IState,
    IState,
    { creature: Creature; newPos: Position }
  >;
  movePlayer: ActionHandlerWithPayload<IState, IState, Direction>;
  parseCommand: ActionHandlerWithPayload<IState, IState, string>;
  setCommandMode: ActionHandlerWithPayload<IState, IState, string>;
  setDisplayOrigin: ActionHandlerWithPayload<IState, IState, [number, number]>;
  setInputText: ActionHandlerWithPayload<IState, IState, string>;
  setPlayer: ActionHandlerWithPayload<IState, IState, Player>;
  setPlayerName: ActionHandlerWithPayload<IState, IState, string>;
  setSplash: ActionHandlerWithPayload<IState, IState, boolean>;
  setWorld: ActionHandlerWithPayload<IState, IState, World>;
  togglePaused: ActionHandlerWithPayload<IState, IState, null>;
}

export const actions: IActions = {
  addCreature: ({ commit }, creature) => {
    commit("ADD_CREATURE", creature);
  },
  addMessage: ({ commit }, data) => {
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
  togglePaused({ commit }) {
    commit("TOGGLE_PAUSED");
  },
};
