<template>
  <div id="surroundings-output">
    <div v-for="(value, key) in surroundings" :key="key">
      {{key}}
      <div v-if="value" v-for="(entity, index) in value" :key="index">
        Level {{entity.level}} {{entity.name}} ({{entity.dir}})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    surroundings() {
      if (this.$store.getters.worldExists) {
        // console.log(this.$store.getters.surroundings);
        return this.$store.getters.surroundings;
      }
    },
    getColour(lvl) {
      let diff = lvl - this.$store.getters.player.level;
      let colour;
      if (diff > 10) {
        colour = "hsl(0, 100%, 50%)";
      } else if (diff < -10) {
        colour = "hsl(120, 100%, 50%)";
      } else {
        // converts numbers from 10 to -10 into a val from 120 to 0
        colour = `hsl(${120 - (diff + 10) * 6}, 100%, 50%)`;
      }
      return colour;
    },
    getStyle(lvl) {
      let colour = this.getColour;
      return "color: " + colour;
    }
  }
};
</script>

<style>
#surroundings-output {
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.85em;
  white-space: pre-wrap;
}

#surroundings-output::-webkit-scrollbar {
  width: 8px;
}

#surroundings-output::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#surroundings-output::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>
