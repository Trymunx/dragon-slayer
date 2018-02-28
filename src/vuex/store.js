import Vue from "vue";
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
      { entity: "Me", message: "Thanks guys." },
      { entity: "Quest giver", message: "You receive a quest, it's to go and pick up a whole load of shit then fight some monsters and collect something from them and craft that stuff together to make an item." },
      { entity: "", message: "You collect the stuff." },
      { entity: "", message: "You hit the rat for so much damage, numbers etc." },
      { entity: "Rat", message: "The rat attacks you." },
      { entity: "", message: "You fight the creatures, gathering their whatever." },
      { entity: "Update", message: "You craft the item." },
      { entity: "Quest giver", message: "You hand the item to the quest giver and they give you some gold and a life lesson." }
    ],
    playerName: "Player Name"
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
});