<template>
  <div id="player-information">
    <template v-if="worldExists">
      <div class="player-name">{{player.name}}</div>
      <div class="info-field">Level: {{player.level}}
        <span class="bar-container">XP: [<span class="bar">{{experienceBar}}</span>]</span>
      </div>
      <div class="info-field">
        <span>HP:
          <span :class="{'hp-green': hpHigh, 'hp-amber': hpMedium, 'hp-red': hpLow}">
            {{hp.current}}
          </span>
          <span>/ {{hp.max}}</span>
        </span>
        <span class="bar-container">
          [<span
            class="bar"
            :class="{'hp-green': hpHigh, 'hp-amber': hpMedium, 'hp-red': hpLow}"
            >{{hpBar}}</span>]
        </span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    experienceBar() {
      const barLength = 30;
      const xpBarLength = Math.round(barLength * this.$store.getters.player.xpPercentage);
      return "|".repeat(xpBarLength).padEnd(barLength, " ");
    },
    hp() {
      return this.$store.getters.player.hp;
    },
    hpBar() {
      const barLength = 30;
      const hpLength = Math.round(
        barLength * this.$store.getters.player.hp.current / this.$store.getters.player.hp.max
      );
      return "|".repeat(hpLength).padEnd(barLength, " ");
    },
    hpHigh() {
      return this.hp.current > 0.65 * this.hp.max;
    },
    hpLow() {
      return this.hp.current < 0.2 * this.hp.max;
    },
    hpMedium() {
      return !this.hpHigh && !this.hpLow;
    },
    player() {
      return this.$store.getters.player;
    },
    worldExists() {
      return this.$store.getters.worldExists;
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.bar {
  font-weight: bold;
  white-space: pre-wrap;
}

.bar-container {
  font-size: 13px;
}

.hp-green {
  color: var(--hp-green);
}
.hp-amber {
  color: var(--hp-amber);
}
.hp-red {
  color: var(--hp-red);
}

.info-field {
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  padding: 4px 0px;
}

#player-information {
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
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
  font-size: 1.3em;
  font-weight: bold;
  padding: 8px;
  text-align: center;
}
</style>
