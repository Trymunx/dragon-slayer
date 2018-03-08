<template>
  <div id="player-stats">
    Player Stats
  </div>
</template>

<script>
export default {};
</script>

<style>
#player-stats {
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.85em;
  white-space: pre-wrap;
}

#player-stats::-webkit-scrollbar {
  width: 8px;
}

#player-stats::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#player-stats::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>