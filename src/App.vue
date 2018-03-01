<template>
  <div id="app">
    <Output/>
    <Overview/>
    <Inventory/>
    <input-bar/>
  </div>
</template>

<script>
import Output from "./components/Output";
import Overview from "./components/Overview";
import Inventory from "./components/Inventory";
import InputBar from "./components/InputBar";

export default {
  name: "App",
  components: {
    Output,
    Overview,
    Inventory,
    InputBar
  },
  created: function() {
    window.addEventListener("keydown", this.focusInput);
  },
  methods: {
    focusInput(event) {
      document.getElementById("input-text").focus();
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
}

#app {
  font-family: "Courier New", Courier, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
  grid-template-columns: 1fr 425px;
  grid-template-rows: auto 1fr 30px;
  grid-template-areas:
    "output overview"
    "output inventory"
    "input inventory";
  background-color: var(--ui-dark);
  font-size: 0.95em;
}

@media (max-width: 850px) {
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
