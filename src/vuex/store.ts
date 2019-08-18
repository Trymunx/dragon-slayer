// import { actions } from "./actions";
import { ActivityState } from "../game/entities/entity";
import { Creature } from "../game/entities/creatures";
import { Player } from "../game/entities/player";
import Vue from "vue";
import Vuex from "vuex";
import World from "../game/world/World";
import { Direction, getDirStringFromVector, parseDir } from "../game/utils/direction";
import { Item, Message, SurroundingsItem } from "../types";
import Position, { Vector, VTS } from "../game/world/position";

Vue.use(Vuex);

interface Surroundings {
  creatures: {
    creature: Creature;
    dir: string;
    dist: number;
  }[];
  items: {
    [name: string]: SurroundingsItem;
  };
}

export interface InitialState {
  commandMode: string;
  creatures: {
    [location: string]: Creature[];
  };
  displayOrigin: [number, number];
  highlit: Record<string, {} | { colour: string; symbol: string }>;
  inputText: string;
  messages: Message[];
  player: Player;
  splash: boolean;
  world?: World;
}

const InitialState: InitialState = {
  commandMode: "text",
  creatures: {},
  displayOrigin: [0, 0],
  highlit: {},
  inputText: "",
  messages: [],
  player: new Player(),
  splash: true,
};

const store = new Vuex.Store({
  actions: {
    addCreature({ commit }, creature: Creature) {
      commit("ADD_CREATURE", creature);
    },
    addMessage({ commit }, data: { entity: string; message: string }) {
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
    moveCreature({ commit }, { creature, newPos }: { creature: Creature; newPos: Vector }) {
      commit("MOVE_CREATURE", { creature, newPos });
    },
    movePlayer({ state, commit }, dir: Direction) {
      if (state.player.currentActivityState === ActivityState.MOVING) {
        commit("MOVE_PLAYER", parseDir(dir));
      } else if (state.player.currentActivityState === ActivityState.DEAD) {
        commit("ADD_MESSAGE", {
          entity: "",
          message: "You cannot move when you are dead.",
        });
      } else {
        commit("ADD_MESSAGE", {
          entity: "Can't esacpe!",
          message: "You can't move while you're being attacked. Use \"r\" to attempt to run away.",
        });
      }
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
    // startGame({ commit }) {
    // commit("START_GAME");
    // },
  },

  getters: {
    creatures: state => state.creatures,
    creaturesAt: state => (x: number, y: number): Array<Creature> => {
      return state.creatures[VTS(x, y)] || [];
    },
    creaturesWithinRadius: state => (
      pos: Position,
      radius: number = 10
    ): Record<string, Creature[]> => {
      if (!pos) {
        console.warn("No player position in creatureWithinRadius, returning all creatures");
        return state.creatures;
      }
      const creatures: Record<string, Creature[]> = {};
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        for (let x = pos.x - radius; x < pos.x + radius; x++) {
          if (state.creatures[VTS(x, y)]) {
            creatures[VTS(x, y)] = state.creatures[VTS(x, y)];
          }
        }
      }
      return creatures;
    },
    displayOrigin: state => state.displayOrigin,
    goldOnTile: state => (x: number, y: number) => {
      const tile = state.world && state.world.getTile(x, y);
      return tile ? tile.gold : 0;
    },
    highlit: state => state.highlit || {},
    inputText: state => state.inputText,
    instantMode: state => state.commandMode === "instant",
    itemsOnTile: state => (x: number, y: number) => {
      const tile = state.world && state.world.getTile(x, y);
      return tile ? tile.items : [];
    },
    messages: state => state.messages,
    player: state => state.player,
    playerLevel: state => state.player.level,
    playerName: state => state.player.name,
    playerPos: state => state.player.position || new Position(0, 0),
    splash: state => state.splash,
    surroundings: state => (radius: number = 2) => {
      let surr: Surroundings = {
        creatures: [],
        items: {},
      };

      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const pos: Vector = [state.player.position.x + x, state.player.position.y + y];

          const creatures = state.creatures[VTS(...pos)];

          if (creatures && creatures.length > 0) {
            const dir = getDirStringFromVector(x, y);
            const dist = Math.abs(x) + Math.abs(y);
            const creaturesHere = creatures
              .filter((creature: Creature) => !creature.isDead())
              .map((creature: Creature) => ({
                creature,
                dir,
                dist,
              }));
            surr.creatures = surr.creatures.concat(creaturesHere);
          }

          const tile = state.world!.getTile(...pos);
          if (tile.items.length) {
            tile.items.forEach((item: Item) => {
              if (surr.items[item.name]) {
                surr.items[item.name].count++;
                surr.items[item.name].locations[VTS(...pos)] = {};
                if (surr.items[item.name].expanded[VTS(x, y)]) {
                  surr.items[item.name].expanded[VTS(x, y)].count++;
                  surr.items[item.name].expanded[VTS(x, y)].totalValue += item.val;
                } else {
                  surr.items[item.name].expanded[VTS(x, y)] = {
                    count: 1,
                    dir: getDirStringFromVector(x, y),
                    loc: {
                      [VTS(...pos)]: {},
                    },
                    name: item.name,
                    plural: item.plural,
                    totalValue: item.val,
                  };
                }
              } else {
                surr.items[item.name] = {
                  count: 1,
                  expanded: {
                    [VTS(x, y)]: {
                      count: 1,
                      dir: getDirStringFromVector(x, y),
                      loc: {
                        [VTS(...pos)]: {},
                      },
                      name: item.name,
                      plural: item.plural,
                      totalValue: item.val,
                    },
                  },
                  locations: {
                    [VTS(...pos)]: {},
                  },
                  name: item.name,
                  plural: item.plural,
                };
              }
            });
          }
          if (tile.gold) {
            if (surr.items["gold"]) {
              surr.items["gold"].count++;
              surr.items["gold"].locations[VTS(...pos)] = {};
              surr.items["gold"].expanded[VTS(x, y)] = {
                count: tile.gold,
                dir: getDirStringFromVector(x, y),
                loc: {
                  [VTS(...pos)]: {},
                },
                name: "gold",
                plural: "gold",
                totalValue: tile.gold,
              };
            } else {
              surr.items["gold"] = {
                count: tile.gold,
                expanded: {
                  [VTS(x, y)]: {
                    count: tile.gold,
                    dir: getDirStringFromVector(x, y),
                    loc: {
                      [VTS(...pos)]: {},
                    },
                    name: "gold",
                    plural: "gold",
                    totalValue: tile.gold,
                  },
                },
                locations: {
                  [VTS(...pos)]: {},
                },
                name: "gold",
                plural: "gold",
              };
            }
          }
        }
      }

      surr.creatures.sort((a, b) => {
        if (a.dist !== b.dist) {
          return a.dist - b.dist; // Sort by distance
        } else if (a.creature.level !== b.creature.level) {
          return b.creature.level - a.creature.level; // Then descending order of level
        } else {
          return b.creature.hp.current - a.creature.hp.current; // Then amount of hp
        }
      });

      return surr;
    },
    world: state => state.world,
    worldExists: state => !!state.world,
  },

  mutations: {
    ADD_CREATURE(state, creature: Creature) {
      if (state.creatures[VTS(creature.position.x, creature.position.y)]) {
        const creatures = state.creatures[VTS(creature.position.x, creature.position.y)]
          .concat([creature])
          .sort((a, b) => b.level - a.level);
        state.creatures[VTS(creature.position.x, creature.position.y)] = creatures;
      } else {
        Vue.set(state.creatures, creature.position.key, [creature]);
      }
    },
    ADD_MESSAGE(state, { entity, message }: Message) {
      state.messages.push({
        entity: entity,
        message: message,
      });
    },
    CLEAR_HIGHLIGHTED(state) {
      state.highlit = {};
    },
    DROP_ITEMS(state, { gold, items, pos }: { gold: number; items: Item[]; pos: Position }) {
      const tile = state.world!.getTile(pos.x, pos.y);
      tile.items.push(...items);
      tile.gold += gold;
    },
    HIGHLIGHT_TILES(state, tiles) {
      state.highlit = tiles;
    },
    MOVE_CREATURE(state, { creature, newPos }: { creature: Creature; newPos: Vector }) {
      if (state.creatures[VTS(...newPos)]) {
        state.creatures[VTS(...newPos)].push(
          ...state.creatures[creature.position.key].splice(
            state.creatures[creature.position.key].indexOf(creature),
            1
          )
        );
        state.creatures[VTS(...newPos)].sort((a, b) => b.level - a.level);
      } else {
        Vue.set(
          state.creatures,
          VTS(...newPos),
          state.creatures[creature.position.key].splice(
            state.creatures[creature.position.key].indexOf(creature),
            1
          )
        );
      }
    },
    MOVE_PLAYER(state, [x, y]) {
      state.player.position.x += x;
      state.player.position.y += y;
    },
    SET_COMMAND_MODE(state, mode) {
      state.commandMode = mode;
    },
    SET_DISPLAY_ORIGIN(state, vector) {
      state.displayOrigin = vector;
    },
    SET_INPUT_TEXT(state, text) {
      state.inputText = text;
    },
    SET_PLAYER(state, player) {
      state.player = player;
    },
    SET_PLAYER_NAME(state, name) {
      state.player.name = name;
    },
    SET_SPLASH(state, val) {
      state.splash = val;
    },
    SET_WORLD(state, world) {
      Vue.set(state, "world", world);
    },
    START_GAME() {
      console.log("Probably not going to work here buddy");
    },
  },

  state: InitialState,
});

export default store;
