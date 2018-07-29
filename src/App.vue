<template>
  <div id="app" @click="hideContextMenu" @click.right.prevent="showContextMenu">
    <Output/>
    <Overview/>
    <player-stats/>
    <player-inventory/>
    <input-bar/>
    <context-menu/>
  </div>
</template>

<script>
import Output from "./components/Output";
import Overview from "./components/Overview";
import InputBar from "./components/InputBar";
import ContextMenu from "./components/ContextMenu";
import PlayerStats from "./components/PlayerStats";
import PlayerInventory from "./components/PlayerInventory";

export default {
  name: "App",
  components: {
    Output,
    Overview,
    PlayerStats,
    PlayerInventory,
    InputBar,
    ContextMenu
  },
  created() {
    this.$game.start();
    window.addEventListener("keyup", this.handleInput);
  },
  methods: {
    handleInput(event) {
      if (event.key === "Enter") {
        document.querySelector("#input-text").focus();
      } else if (event.key === "Escape") {
        document.querySelector("#input-text").blur();
      } else if (this.$store.getters.instantMode) {
        this.$game.receiveInput(event.key);
      }
    },
    contextMenuItems(vm, menuItems) {
      return [{
              text: "WhoAmI?",
              action: () => {
                console.log(vm);
              }
            }];
    }
  }
};
</script>

<style>
:root {
  /* UI colours */
  --ui: #333231;
  --ui-darker: #262626;
  --ui-border: #1e1e1e;
  --ui-dark: #2b2b2b;
  /* Text colours */
  --text: #daddd8;
  --text-blur: #bababa;
  --select: #323336;
}

#app {
  font-family: "Courier New", Courier, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-template-rows: auto 2fr 1fr 30px;
  grid-template-areas:
    "overview player-stats"
    "overview player-stats"
    "output player-inventory"
    "input player-inventory";
  background-color: var(--ui-dark);
  font-size: 0.95em;
}

::-moz-selection {
  background: var(--select);
}
::selection {
  background: var(--select);
}
::-o-selection {
  background: var(--select);
}
::-webkit-selection {
  background: var(--select);
}
::-ms-selection {
  background: var(--select);
}

@media (max-width: 900px) {
  #app {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr 30px;
    grid-template-areas:
      "player-stats"
      "output"
      "input";
  }

  #overview,
  #player-inventory {
    display: none;
  }
}

#output {
  grid-area: output;
}

#overview {
  grid-area: overview;
}

#input-bar {
  grid-area: input;
}

#player-stats {
  grid-area: player-stats;
}

#player-inventory {
  grid-area: player-inventory;
}

#app,
html,
body {
  height: 100%;
  margin: 0;
}
</style>
