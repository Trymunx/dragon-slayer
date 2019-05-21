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
import ContextMenu from "./components/ContextMenu";
import InputBar from "./components/InputBar";
import Output from "./components/Output";
import Overview from "./components/Overview";
import PlayerInventory from "./components/PlayerInventory";
import Surroundings from "./components/Surroundings";

export default {
  name: "App",
  components: {
    Output,
    Overview,
    Surroundings,
    PlayerInventory,
    InputBar,
    ContextMenu,
  },
  created() {
    this.$game.start();
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    handleKeyUp(event) {
      switch (event.key) {
        case "Enter":
          if (
            document.querySelector("#input-text").value === "" &&
            !this.$store.instantMode &&
            this.$store.worldExists
          ) {
            document.querySelector("#input-text").blur();
          } else {
            document.querySelector("#input-text").focus();
          }
          break;
        case "Escape":
          document.querySelector("#input-text").blur();
          break;
        default:
          this.$game.receiveInputKeyUp(event.key);
          break;
      }
    },
    handleKeyDown(event) {
      if ((event.key !== "Enter" || event.key !== "Escape") && this.$store.getters.instantMode) {
        this.$game.receiveInputKeyDown(event.key);
      }
    },
    contextMenuItems(vm, menuItems) {
      return [
        {
          text: "Cancel",
          action: () => {
            console.log(vm);
          },
        },
      ];
    },
  },
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
  font-family: "Oxygen Mono", monospace;
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
