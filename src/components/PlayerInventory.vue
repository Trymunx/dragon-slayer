<template>
  <div id="player-inventory">
    Player Inventory
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
#player-inventory {
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.85em;
  white-space: pre-wrap;
}

#player-inventory::-webkit-scrollbar {
  width: 8px;
}

#player-inventory::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#player-inventory::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>

