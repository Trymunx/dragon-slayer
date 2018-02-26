<template>
  <div id="map">Map</div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

#map {
  grid-area: map;
  padding: 2px 10px 10px 10px;
  margin-bottom: 2px;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.9em;
  white-space: pre-wrap;
  text-align: center;
  min-width: 70px;
  max-height: 75vh;
  overflow-y: auto;
}

#map::-webkit-scrollbar {
  width: 8px;
}

#map::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#map::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>
