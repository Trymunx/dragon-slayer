import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    messages: [
      { entity: "Test messages follow:", message: "" },
      { entity: "Alpvax", message: "I'm helping you develop your game." },
      { entity: "p-Dandy", message: "I'm fixing your broken shit." },
      {
        entity:
          "This is a really long name that should break over a few lines",
        message:
          "I'm trying to help fix your broken shit. I'm trying to help fix your broken shit. I'm trying to help fix your broken shit. I'm trying to help fix your broken shit. I'm trying to help fix your broken shit."
      },
      { entity: "Me", message: "Thanks guys." }
    ],
    playerName: "(no player name set)"
  },

  getters: {
    playerName: (state) => state.playerName,
    messages: (state) => state.messages
  },

  actions: {
    addMessage({ commit }, data) {
      commit("ADD_MESSAGE", data);
    }
  },

  mutations: {
    ADD_MESSAGE(state, data) {
      state.messages.push({
        entity: data.entity,
        message: data.message
      });
    }
  }
})