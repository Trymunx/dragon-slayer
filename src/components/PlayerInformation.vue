<template>
  <div id="player-information">
    <template v-if="worldExists">
      <div class="player-name">{{player.name}}</div>
      <div class="info-field">Level: {{player.level}}
        <span class="bar-container">XP: ▐<span class="xp-bar">{{experienceBar}}</span>▌</span>
      </div>
      <div class="info-field">
        <span>HP:
          <span :class="{'hp-green': hpHigh, 'hp-amber': hpMedium, 'hp-red': hpLow}">
            {{hp.current}}
          </span>
          <span>/ {{hp.max}}</span>
        </span>
        <span class="bar-container">
          ▐<span
            :class="{'hp-green': hpHigh, 'hp-amber': hpMedium, 'hp-red': hpLow}"
            >{{hpBar}}</span>▌
        </span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    experienceBar() {
      return this.calculateBar(this.$store.getters.player.xpPercentage);
    },
    hp() {
      return this.$store.getters.player.hp;
    },
    hpBar() {
      const hpPercent = this.hp.current / this.hp.max;
      return this.calculateBar(hpPercent);
    },
    hpHigh() {
      return this.hp.current > 0.4 * this.hp.max;
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
  methods: {
    calculateBar(pc) {
      const length = 25;
      const chars = ["", "▌", "█"];
      const bits = length * (chars.length - 1);
      const wholePart = Math.floor(pc * length);
      const partial = Math.floor(pc * bits) % (chars.length - 1);
      return chars[2].repeat(wholePart) + chars[partial] + "░".repeat(length - wholePart - partial);
    },
  },
};
</script>

<style>
.bar-container {
  align-items: center;
  display: flex;
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
  align-items: center;
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

.xp-bar {
  color: grey;
}
</style>
