<template>
  <div id="player-data">
    <player-stats/>
    <player-inventory/>
  </div>
</template>

<script>
import PlayerInventory from "./PlayerInventory.vue";
import PlayerStats from "./PlayerStats.vue"
export default {
  data() {
    return {};
  },
  components: {
    PlayerStats,
    PlayerInventory
  }
};
</script>

<style>
#player-data {
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.85em;
  white-space: pre-wrap;
}

#player-data::-webkit-scrollbar {
  width: 8px;
}

#player-data::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#player-data::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>
