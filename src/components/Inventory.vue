<template>
  <div id="inventory">Inventory</div>
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

#inventory {
  grid-area: inventory;
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.85em;
  white-space: pre-wrap;
  min-width: 70px;
}

#inventory::-webkit-scrollbar {
  width: 8px;
}

#inventory::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#inventory::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>
