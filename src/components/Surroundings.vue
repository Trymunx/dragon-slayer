<template>
  <div id="surroundings-output">
    <div v-if="worldExists" class="wrapper">
      {{surroundings.creatures.length}} Creature{{surroundings.creatures.length === 1 ? '' : 's'}}:
      <div class="table-wrapper">
        <table class="surrounds-categories">
          <tbody>
            <tr v-for="(entity, index) in surroundings.creatures"
                :key="index"
                @mouseenter="highlight(entity)"
                @mouseleave="highlight()">
              <td :style="getStyle(entity.level)" class="symbol">{{entity.symbol}}</td>
              <td class="creature-name">{{entity.name}}</td>
              <td class="creature-level">Level</td>
              <td :style="getStyle(entity.level)">{{entity.level}}</td>
              <td>({{entity.dir}})</td>
            </tr>
          </tbody>
        </table>
      </div>
      {{surroundings.items.length}} Item{{surroundings.items.length === 1 ? '' : 's'}}:
      <div class="table-wrapper">
        <table class="surrounds-categories">
          <tbody>
            <tr v-for="(entity, index) in surroundings.items" :key="index">
              <!-- <td :style="getStyle(entity.level)" class="symbol">{{entity.symbol}}</td> -->
              <td class="item-name">{{entity.name}}</td>
              <!-- <td class="creature-level">Level</td> -->
              <!-- <td :style="getStyle(entity.level)">{{entity.level}}</td> -->
              <td>({{entity.dir}})</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { levelColour } from "../game/utils/colours";
import display from "../game/overview/Display";

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
    highlight(entity) {
      if (entity) {
        let displayOptions = display.getOptions();
        let a = Math.floor(displayOptions.width / 2) + entity.loc[0];
        let b = Math.floor(displayOptions.height / 2) + entity.loc[1];
        display.draw(a, b, entity.symbol, levelColour(entity.level, 50), "#0a0a0a");
      } else {
        display.drawWorld();
      }
    },
  },
};
</script>

<style>
#surroundings-output {
  overflow-y: visible;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 18px;
}

.table-wrapper::-webkit-scrollbar {
  width: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background-color: #2b2b2b;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background-color: #404040;
}

.surrounds-categories {
  table-layout: fixed;
  padding: 0px;
  width: 100%;
  font-size: 14px;
}

.surrounds-categories tr:hover {
  background-color: var(--ui-border);
}

.surrounds-categories td {
  padding: 3px 4px;
}

.surrounds-categories td:last-child {
  text-align: right;
  text-transform: capitalize;
  width: 110px;
}

.wrapper {
  height: 100%;
  padding: 20px 8px 20px 15px;
  overflow-y: hidden;
}

.table-wrapper {
  margin: 6px 0px 16px;
  height: 40%;
  overflow-y: scroll;
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
