import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    messages: [],
    playerName: "",
    inputText: "",
    commandMode: "text"
  },

  getters: {
    playerName: (state) => state.playerName,
    messages: (state) => state.messages,
    instantMode: (state) => state.commandMode === "instant" ? true : false,
    inputText: (state) => state.inputText
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
    }
  },

  mutations: {
    SET_PLAYER_NAME(state, name) {
      state.playerName = name;
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
    }
  }
});

export default store;
