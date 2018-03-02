<template>
  <div id="app" @click.right.prevent="showContextMenu">
    <Output/>
    <Overview/>
    <Inventory/>
    <input-bar/>
    <context-menu v-show="contextMenuVisible"/>
  </div>
</template>

<script>
import Output from "./components/Output";
import Overview from "./components/Overview";
import Inventory from "./components/Inventory";
import InputBar from "./components/InputBar";
import ContextMenu from "./components/ContextMenu";

export default {
  name: "App",
  components: {
    Output,
    Overview,
    Inventory,
    InputBar,
    ContextMenu
  },
  created: function() {
    window.addEventListener("keydown", this.focusInput);
    window.addEventListener("click", this.showContextMenu);
  },
  methods: {
    focusInput(event) {
      document.getElementById("input-text").focus();
    },
    showContextMenu(event) {
      if (event.button === 2) {
        this.contextMenuVisible = true;
        let menu = document.getElementsByClassName("context-menu")[0];

        this.$nextTick(() => {
          let menuWidth = menu.offsetWidth;
          let menuHeight = menu.offsetHeight;
          if (event.x + menuWidth < window.innerWidth) {
            menu.style.left = event.x + "px";
          } else {
            menu.style.left = event.x - menuWidth + "px";
          }
          if (event.y + menuHeight < window.innerHeight) {
            menu.style.top = event.y + "px";
          } else {
            menu.style.top = event.y - menuHeight + "px";
          }
        });
      } else {
        this.contextMenuVisible = false;
      }
    }
  },
  data() {
    return {
      contextMenuVisible: false
    };
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
  grid-template-columns: 1fr 410px;
  grid-template-rows: auto 1fr 30px;
  grid-template-areas:
    "output overview"
    "output inventory"
    "input inventory";
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
    grid-template-rows: 1fr 30px;
    grid-template-areas:
      "output"
      "input";
  }

  #overview,
  #inventory {
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

#inventory {
  grid-area: inventory;
}

#app,
html,
body {
  height: 100%;
  margin: 0;
}
</style>
