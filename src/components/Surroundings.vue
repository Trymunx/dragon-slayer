<template>
  <div id="surroundings-output">
    <div v-if="worldExists">
      Creatures:
      <table class="surrounds-categories">
        <tbody>
          <tr v-for="(entity, index) in surroundings.creatures" :key="index">
            <td :style="getStyle(entity.level)" class="symbol">{{entity.symbol}}</td>
            <td class="creature-name">{{entity.name}}</td>
            <td class="creature-level">Level</td>
            <td :style="getStyle(entity.level)">{{entity.level}}</td>
            <td>({{entity.dir}})</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { levelColour } from "../game/utils/colours";

export default {
  computed: {
    worldExists() {
      return this.$store.getters.worldExists;
    },
    surroundings() {
      // console.log(this.$store.getters.surroundings);
      return this.$store.getters.surroundings;
    },
  },
  methods: {
    getStyle(lvl) {
      return "color: " + levelColour(lvl);
    },
  },
};
</script>

<style>
#surroundings-output {
  padding: 20px 8px 20px 15px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 18px;
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

.surrounds-categories {
  table-layout: fixed;
  padding: 8px 0px;
  width: 100%;
  font-size: 14px;
  opacity: 0.9;
}

.surrounds-categories td {
  padding: 3px 4px;
}

.surrounds-categories td:last-child {
  text-align: right;
  text-transform: capitalize;
  width: 110px;
}

.symbol {
  font-size: 22px;
  width: 14px;
}

.creature-name {
  font-size: 1.2em;
  text-transform: capitalize;
  width: 100px;
}
.creature-level {
  text-align: right;
  width: 40px;
}
</style>
