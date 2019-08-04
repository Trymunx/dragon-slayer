<template>
  <div id="player-information">
    <div class="player-name">{{player.name}}</div>
    <div>Level: {{player.level}}
      <span class="experience-bar">XP: {{experienceBar}}</span>
    </div>
    <!-- At some point this will show player inventory, but for now it will show position -->
    Player position:
    {{player.position.x}},{{player.position.y}}
  </div>
</template>

<script>
export default {
  computed: {
    experienceBar() {
      const barLength = 30;
      const emptyLength = Math.round(barLength * this.$store.getters.player.xpPercentage);
      const bar = "|".repeat(emptyLength).padEnd(barLength, " ");
      return "[" + bar + "]";
    },
    player() {
      return this.$store.getters.player;
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.experience-bar {
  white-space: pre-wrap;
}

#player-information {
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.85em;
}

#player-information::-webkit-scrollbar {
  width: 8px;
}

#player-information::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#player-information::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}

.player-name {
  font-size: 1.4em;
  font-weight: bold;
  text-align: center;
}
</style>
