import { Creature } from "../game/entities/creatures";
import { getDirFromVector } from "../game/utils/direction";
import { Player } from "../game/entities/player";
import Position from "../game/world/position";
import Vue from "vue";
import Vuex from "vuex";
import World from "../game/world/World";
import { Item, Message, SurroundingsItem } from "../types";

Vue.use(Vuex);

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface InitialState {
  commandMode: string;
  creatures: {
    [location: string]: Creature[];
  };
  displayOrigin: Position;
  highlit: [];
  inputText: string;
  messages: Message[];
  player: Player;
  splash: boolean;
  world?: World;
}

const InitialState: InitialState = {
  commandMode: "text",
  creatures: {},
  displayOrigin: new Position(0, 0),
  highlit: [],
  inputText: "",
  messages: [],
  player: new Player(),
  splash: true,
};

const store = new Vuex.Store({
  actions: {
    addCreature({ commit }, creature) {
      commit("ADD_CREATURE", creature);
    },
    addMessage({ commit }, data) {
      commit("ADD_MESSAGE", data);
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
      if (tiles) {
        commit("HIGHLIGHT_TILES", tiles);
      } else {
        commit("CLEAR_HIGHLIGHTED");
      }
    },
    moveCreature({ commit }, { creature, newPos }: { creature: Creature; newPos: Position }) {
      commit("MOVE_CREATURE", { creature, newPos });
    },
    movePlayer({ commit }, dir: Direction) {
      switch (dir) {
        case "UP":
          commit("MOVE_PLAYER", [0, -1]);
          break;
        case "DOWN":
          commit("MOVE_PLAYER", [0, 1]);
          break;
        case "LEFT":
          commit("MOVE_PLAYER", [-1, 0]);
          break;
        case "RIGHT":
          commit("MOVE_PLAYER", [1, 0]);
          break;
      }
    },
    parseCommand(_, command) {
      console.log("Parsing", command);
    },
    // receiveInput({ commit }, input) {
    // gsMan.receiveInput(input);
    // },
    sendMessageAtPosition({ commit, state }, { entity, message, position }) {
      // Only send messages when player is there
      if (state.player.position.x === position[0] && state.player.position.y === position[1]) {
        commit("ADD_MESSAGE", { entity, message });
      }
    },
    setCommandMode({ commit }, mode) {
      commit("SET_COMMAND_MODE", mode);
    },
    setDisplayOrigin({ commit }, pos) {
      commit("SET_DISPLAY_ORIGIN", pos);
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
    creaturesAt: state => (x: number, y: number) => {
      return state.creatures[new Position(x, y).key()];
    },
    creaturesWithinRadius: state => (pos: Position, radius: number = 10) => {
      if (!pos) {
        return state.creatures;
      }
      const creatures = new Map();
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        for (let x = pos.x - radius; x < pos.x + radius; x++) {
          if (state.creatures[new Position(x, y).key()]) {
            creatures.set(new Position(x, y).key(), state.creatures[new Position(x, y).key()]);
          }
        }
      }
      return creatures;
    },
    displayOrigin: state => state.displayOrigin,
    highlit: state => state.highlit,
    inputText: state => state.inputText,
    instantMode: state => state.commandMode === "instant",
    messages: state => state.messages,
    player: state => state.player,
    playerLevel: state => state.player.level,
    playerName: state => state.player.name,
    playerPos: state => state.player.position,
    splash: state => state.splash,
    surroundings: state => (radius: number = 2) => {
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

      let surr: Surroundings = {
        creatures: [],
        items: {},
      };

      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const pos: Position = new Position(
            state.player.position.x + x,
            state.player.position.y + y
          );

          if (state.creatures[pos.key()] && state.creatures[pos.key()].length > 0) {
            const dir = getDirFromVector(x, y);
            const dist = Math.abs(x) + Math.abs(y);
            const creaturesHere = state.creatures[pos.key()]
              .filter((creature: Creature) => !creature.isDead())
              .map((creature: Creature) => ({
                creature,
                dir,
                dist,
              }));
            surr.creatures = surr.creatures.concat(creaturesHere);
          }

          const tile = state.world!.getTile(pos);
          if (tile.items.length) {
            tile.items.forEach((item: Item) => {
              if (surr.items[item.name]) {
                surr.items[item.name].count++;
                surr.items[item.name].locations[pos.key()] = {};
                if (surr.items[item.name].expanded[new Position(x, y).key()]) {
                  surr.items[item.name].expanded[new Position(x, y).key()].count++;
                  surr.items[item.name].expanded[new Position(x, y).key()].totalValue += item.val;
                } else {
                  surr.items[item.name].expanded[new Position(x, y).key()] = {
                    count: 1,
                    dir: getDirFromVector(x, y),
                    loc: {
                      [pos.key()]: {},
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
                    [new Position(x, y).key()]: {
                      count: 1,
                      dir: getDirFromVector(x, y),
                      loc: {
                        [pos.key()]: {},
                      },
                      name: item.name,
                      plural: item.plural,
                      totalValue: item.val,
                    },
                  },
                  locations: {
                    [pos.key()]: {},
                  },
                  name: item.name,
                  plural: item.plural,
                };
              }
            });
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
      if (state.creatures[creature.position.key()]) {
        const creatures = state.creatures[creature.position.key()]
          .concat([creature])
          .sort((a, b) => b.level - a.level);
        state.creatures[creature.position.key()] = creatures;
      } else {
        Vue.set(state.creatures, creature.position.key(), [creature]);
      }
    },
    ADD_MESSAGE(state, { entity, message }: Message) {
      state.messages.push({
        entity: entity,
        message: message,
      });
    },
    CLEAR_HIGHLIGHTED(state) {
      state.highlit = [];
    },
    DROP_ITEMS(state, { items, pos }: { items: Item[]; pos: Position }) {
      const tile = state.world!.getTile(pos);
      tile.items.push(...items);
    },
    HIGHLIGHT_TILES(state, tiles) {
      state.highlit = tiles;
    },
    MOVE_CREATURE(state, { creature, newPos }: { creature: Creature; newPos: Position }) {
      if (state.creatures[newPos.key()]) {
        state.creatures[newPos.key()].push(
          ...state.creatures[creature.position.key()].splice(
            state.creatures[creature.position.key()].indexOf(creature),
            1
          )
        );
        state.creatures[newPos.key()].sort((a, b) => b.level - a.level);
      } else {
        Vue.set(
          state.creatures,
          newPos.key(),
          state.creatures[creature.position.key()].splice(
            state.creatures[creature.position.key()].indexOf(creature),
            1
          )
        );
      }
    },
    MOVE_PLAYER(state, delta: [number, number]) {
      const pos = new Position(
        state.player.position.x + delta[0],
        state.player.position.y + delta[1]
      );
      state.player = Object.assign(state.player, { pos });
    },
    SET_COMMAND_MODE(state, mode) {
      state.commandMode = mode;
    },
    SET_DISPLAY_ORIGIN(state, pos) {
      state.displayOrigin = pos;
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
      state.world = world;
    },
    START_GAME() {
      console.log("Probably not going to work here buddy");
    },
  },

  state: InitialState,
});

export default store;
