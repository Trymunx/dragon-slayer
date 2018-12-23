<template>
  <div id="app" @click="hideContextMenu" @click.right.prevent="showContextMenu">
    <Output/>
    <Overview/>
    <surroundings/>
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
import Surroundings from "./components/Surroundings";
import PlayerInventory from "./components/PlayerInventory";

export default {
  name: "App",
  components: {
    Output,
    Overview,
    Surroundings,
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
      event.preventDefault();
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
    "upper-main upper-right-col"
    "upper-main upper-right-col"
    "lower-main lower-right-col"
    "bottom-bar lower-right-col";
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
    grid-template-rows: 2fr 1fr 30px;
    grid-template-areas:
      "upper-main"
      "lower-main"
      "bottom-bar";
  }

  #player-inventory,
  #surroundings-output {
    display: none;
  }
}

#overview {
  grid-area: upper-main;
}

#output {
  grid-area: lower-main;
}

#input-bar {
  grid-area: bottom-bar;
}

#surroundings-output {
  grid-area: upper-right-col;
}

#player-inventory {
  grid-area: lower-right-col;
}

#app,
html,
body {
  height: 100%;
  margin: 0;
}
</style>
