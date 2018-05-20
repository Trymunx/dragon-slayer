import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    messages: [],
    playerName: "",
    inputText: ""
  },

  getters: {
    playerName: (state) => state.playerName,
    messages: (state) => state.messages,
    inputText: (state) => state.inputText
  },

  actions: {
    setPlayerName({ commit }, name) {
      commit("SET_PLAYER_NAME", name);
    },
    addMessage({ commit }, data) {
      commit("ADD_MESSAGE", data);
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
    SET_INPUT_TEXT(state, text) {
      state.inputText = text;
    }
  }
});

export default store;
