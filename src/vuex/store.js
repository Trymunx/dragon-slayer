import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    messages: [],
    player: {},
    inputText: "",
    commandMode: "text",
    splash: true,
    world: null,
  },

  getters: {
    playerName: (state) => state.player.name,
    messages: (state) => state.messages,
    instantMode: (state) => state.commandMode === "instant" ? true : false,
    inputText: (state) => state.inputText,
    splash: (state) => state.splash,
    player: (state) => state.player,
    playerPos: (state) => state.player.pos,
    world: (state) => state.world,
    worldExists: (state) => state.world !== null,
    surroundings: (state) => {
      let surr = {
        items: [],
        creatures: [],
      };

      for (let y = -2; y <= 2; y++) {
        for (let x = -2; x <= +2; x++) {
          let tile =
            state.world.getTile(state.player.pos.x + x, state.player.pos.y + y);
          if (tile.items.length) {
            surr.items.push(...tile.items);
          }
          if (tile.creatures.length) {
            tile.creatures.forEach(creature => {
              let dir = [];
              if (y < 0) dir.push("north");
              else if (y > 0) dir.push("south");
              if (x < 0) dir.push("west");
              else if (x > 0) dir.push("east");
              if (!x && !y) dir.push("here");
              creature.dir = dir.join(" ");
              creature.dist = Math.abs(x) + Math.abs(y);
              surr.creatures.push(creature)
            });
          }
        }
      }

      for (let [key, val] of Object.entries(surr)) {
        val.sort((a, b) => {
          let delta = a.dist - b.dist;
          if (delta === 0 && a.level) {
            return b.level - a.level;
          } else {
            return delta;
          }
        });
      }

      return surr;
    },
  },

  actions: {
    setPlayerName({ commit }, name) {
      commit("SET_PLAYER_NAME", name);
    },
    addMessage({ commit }, data) {
      commit("ADD_MESSAGE", data);
    },
    enterCommand({ commit, state }, text) {
      commit("ADD_MESSAGE", {
        entity: state.playerName,
        message: text
      });
      commit("SET_INPUT_TEXT", "");
    },
    setCommandMode({ commit }, mode) {
      commit("SET_COMMAND_MODE", mode);
    },
    setInputText({ commit }, text) {
      commit("SET_INPUT_TEXT", text);
    },
    startGame({ commit }) {
      // commit("START_GAME");
    },
    receiveInput({ commit }, input) {
      // gsMan.receiveInput(input);
    },
    parseCommand({ commit }, command) {
      console.log("Parsing", command);
    },
    setPlayer({ commit }, player) {
      commit("SET_PLAYER", player);
    },
    setWorld({ commit }, world) {
      commit("SET_WORLD", world);
    },
    setSplash({ commit }, val) {
      commit("SET_SPLASH", val);
    },
    movePlayer({ commit, state }, dir) {
      switch (dir.toUpperCase()) {
        case "UP":
          commit("MOVE_PLAYER_UP");
          break;
        case "DOWN":
          commit("MOVE_PLAYER_DOWN");
          break;
        case "LEFT":
          commit("MOVE_PLAYER_LEFT");
          break;
        case "RIGHT":
          commit("MOVE_PLAYER_RIGHT");
          break;
      }
    },
  },

  mutations: {
    SET_PLAYER_NAME(state, name) {
      state.player.name = name;
    },
    ADD_MESSAGE(state, data) {
      state.messages.push({
        entity: data.entity,
        message: data.message
      });
    },
    SET_COMMAND_MODE(state, mode) {
      state.commandMode = mode;
    },
    SET_INPUT_TEXT(state, text) {
      state.inputText = text;
    },
    START_GAME(state) {
      console.log("Probably not going to work here buddy");
    },
    SET_PLAYER(state, player) {
      state.player = player;
    },
    SET_WORLD(state, world) {
      state.world = world;
    },
    SET_SPLASH(state, val) {
      state.splash = val;
    },
    MOVE_PLAYER_UP(state) {
      const pos = {
        x: state.player.pos.x,
        y: state.player.pos.y - 1,
      };
      state.player = Object.assign({}, state.player, {pos});
    },
    MOVE_PLAYER_DOWN(state) {
      const pos = {
        x: state.player.pos.x,
        y: state.player.pos.y + 1,
      };
      state.player = Object.assign({}, state.player, {pos});
    },
    MOVE_PLAYER_LEFT(state) {
      const pos = {
        x: state.player.pos.x - 1,
        y: state.player.pos.y,
      };
      state.player = Object.assign({}, state.player, {pos});
    },
    MOVE_PLAYER_RIGHT(state) {
      const pos = {
        x: state.player.pos.x + 1,
        y: state.player.pos.y,
      };
      state.player = Object.assign({}, state.player, {pos});
    },
  }
});

export default store;
