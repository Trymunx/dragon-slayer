import Creature from "../game/entities/creatures";
import { getDirFromVector } from "../game/utils/direction";
import Position from "../game/world/position";
import Vue from "vue";
import Vuex from "vuex";
import World from "../game/world/World";
import { Item, Message, SurroundingsItem } from "../types";
import newPlayer, { Player } from "../game/entities/player";

Vue.use(Vuex);

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
  player: newPlayer(),
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
    moveCreature({ commit }, data) {
      commit("MOVE_CREATURE", data);
    },
    movePlayer({ commit }, dir) {
      switch (dir.toUpperCase()) {
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
    sendMessageAtPosition({ commit, state }, data) {
      // Only send messages when player is there
      if (state.player.pos.x === data.position[0] && state.player.pos.y === data.position[1]) {
        commit("ADD_MESSAGE", { entity: data.entity, message: data.message });
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
    playerPos: state => state.player.pos,
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
          const pos: Position = new Position(state.player.pos.x + x, state.player.pos.y + y);

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
          return b.creature.hp - a.creature.hp; // Then amount of hp
        }
      });

      return surr;
    },
    world: state => state.world,
    worldExists: state => !!state.world,
  },

  mutations: {
    ADD_CREATURE(state, creature: Creature) {
      if (state.creatures[creature.pos.key()]) {
        const creatures = state.creatures[creature.pos.key()]
          .concat([creature])
          .sort((a, b) => b.level - a.level);
        state.creatures[creature.pos.key()] = creatures;
      } else {
        Vue.set(state.creatures, creature.pos.key(), [creature]);
      }
    },
    ADD_MESSAGE(state, data: Message) {
      state.messages.push({
        entity: data.entity,
        message: data.message,
      });
    },
    CLEAR_HIGHLIGHTED(state) {
      state.highlit = [];
    },
    DROP_ITEMS(state, data) {
      const tile = state.world!.getTile(data.pos as Position);
      tile.items.push(...data.items);
    },
    HIGHLIGHT_TILES(state, tiles) {
      state.highlit = tiles;
    },
    MOVE_CREATURE(state, data) {
      if (state.creatures[data.newPos]) {
        state.creatures[data.newPos].push(
          ...state.creatures[data.creature.pos].splice(
            state.creatures[data.creature.pos].indexOf(data.creature),
            1
          )
        );
        state.creatures[data.newPos].sort((a, b) => b.level - a.level);
      } else {
        Vue.set(
          state.creatures,
          data.newPos,
          state.creatures[data.creature.pos].splice(
            state.creatures[data.creature.pos].indexOf(data.creature),
            1
          )
        );
      }
    },
    MOVE_PLAYER(state, delta) {
      const pos = [state.player.pos.x + delta[0], state.player.pos.y + delta[1]];
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