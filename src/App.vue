<template>
  <div id="app" class="wrapper">
    <Output/>
    <Map/>
    <Inventory/>
    <input-bar/>
  </div>
</template>

<script>
import Output from "./components/Output";
import Map from "./components/Map";
import Inventory from "./components/Inventory";
import InputBar from "./components/InputBar";

export default {
  name: "App",
  components: {
    Output,
    Map,
    Inventory,
    InputBar
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
}

.wrapper {
  display: grid;
  grid-template-columns: 6fr 2fr;
  grid-template-rows: auto 4fr 30px;
  grid-template-areas:
    "output map"
    "output inventory"
    "input inventory";
  background-color: var(--ui-dark);
  font-size: 0.95em;
}

#output {
  grid-area: output;
}

#input-bar {
  grid-area: input;
}

#map {
  grid-area: map;
}

#inventory {
  grid-area: inventory;
}

.wrapper,
html,
body {
  height: 100%;
  margin: 0;
}
</style>
