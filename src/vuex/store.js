import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

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
        entity: state.playerName,
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
    setDisplayOrigin({ commit }, pos) {
      commit("SET_DISPLAY_ORIGIN", pos);
    },
    // startGame({ commit }) {
    // commit("START_GAME");
    // },
  },

  getters: {
    creatures: state => state.creatures,
    creaturesWithinRadius: state => (pos, radius = 10) => {
      if (!pos) {
        return state.creatures;
      }
      const creatures = new Map();
      for (let y = pos.y - radius; y < pos.y + radius; y++) {
        for (let x = pos.x - radius; x < pos.x + radius; x++) {
          if (state.creatures[[x, y]]) {
            creatures.set([x, y], state.creatures[[x, y]]);
          }
        }
      }
      return creatures;
    },
    creaturesAt: state => (x, y) => {
      return state.creatures[[x, y]];
    },
    displayOrigin: state => state.displayOrigin,
    highlit: state => state.highlit,
    instantMode: state => (state.commandMode === "instant" ? true : false),
    inputText: state => state.inputText,
    messages: state => state.messages,
    player: state => state.player,
    playerLevel: state => state.player.level,
    playerName: state => state.player.name,
    playerPos: state => state.player.pos,
    splash: state => state.splash,
    surroundings: state => (radius = 2) => {
      let surr = {
        items: {},
        creatures: [],
      };

      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const pos = [state.player.pos.x + x, state.player.pos.y + y];

          if (state.creatures[pos] && state.creatures[pos].length > 0) {
            const dir = getDirFromVector(x, y);
            const dist = Math.abs(x) + Math.abs(y);
            const creaturesHere = state.creatures[pos]
              .filter(creature => !creature.isDead())
              .map(creature => ({
                creature,
                dir,
                dist,
              }));
            surr.creatures = surr.creatures.concat(creaturesHere);
          }

          const tile = state.world.getTile(...pos);
          if (tile.items.length) {
            tile.items.forEach(item => {
              if (surr.items[item.name]) {
                surr.items[item.name].count++;
                surr.items[item.name].locations[pos] = {};
                if (surr.items[item.name].expanded[[x, y]]) {
                  surr.items[item.name].expanded[[x, y]].count++;
                  surr.items[item.name].expanded[[x, y]].totalValue += item.val;
                } else {
                  surr.items[item.name].expanded[[x, y]] = {
                    name: item.name,
                    plural: item.plural,
                    count: 1,
                    totalValue: item.val,
                    dir: getDirFromVector(x, y),
                    loc: {
                      [pos]: {},
                    },
                  };
                }
              } else {
                surr.items[item.name] = {
                  name: item.name,
                  plural: item.plural,
                  count: 1,
                  locations: {
                    [pos]: {},
                  },
                  expanded: {
                    [[x, y]]: {
                      name: item.name,
                      plural: item.plural,
                      count: 1,
                      totalValue: item.val,
                      dir: getDirFromVector(x, y),
                      loc: {
                        [pos]: {},
                      },
                    },
                  },
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
    worldExists: state => state.world !== null,
  },

  mutations: {
    ADD_CREATURE(state, creature) {
      if (state.creatures[creature.pos]) {
        state.creatures[creature.pos].push(creature);
        state.creatures[creature.pos].sort((a, b) => b.level - a.level);
      } else {
        Vue.set(state.creatures, creature.pos, [creature]);
      }
    },
    ADD_MESSAGE(state, data) {
      state.messages.push({
        entity: data.entity,
        message: data.message,
      });
    },
    CLEAR_HIGHLIGHTED(state) {
      state.highlit = [];
    },
    DROP_ITEMS(state, data) {
      const tile = state.world.getTile(...data.pos);
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
      const pos = {
        x: state.player.pos.x + delta[0],
        y: state.player.pos.y + delta[1],
      };
      state.player = Object.assign(state.player, { pos });
    },
    SET_COMMAND_MODE(state, mode) {
      state.commandMode = mode;
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
    SET_WORLD(state, world) {
      state.world = world;
    },
    SET_SPLASH(state, val) {
      state.splash = val;
    },
    SET_DISPLAY_ORIGIN(state, pos) {
      state.displayOrigin = pos;
    },
    START_GAME() {
      console.log("Probably not going to work here buddy");
    },
  },

  state: {
    commandMode: "text",
    creatures: {},
    displayOrigin: {},
    highlit: [],
    inputText: "",
    messages: [],
    player: {},
    splash: true,
    world: null,
  },
});

function getDirFromVector(x, y) {
  let dir = [];
  if (y < 0) dir.push("north");
  else if (y > 0) dir.push("south");
  if (x < 0) dir.push("west");
  else if (x > 0) dir.push("east");
  if (!x && !y) dir.push("here");
  return dir.join(" ");
}

export default store;
