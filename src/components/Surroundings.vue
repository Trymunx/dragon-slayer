<template>
  <div id="surroundings-output">
    <div v-if="worldExists" class="wrapper">
      <div class="creatures-wrapper">
        {{surroundings.creatures.length}} Creature{{surroundings.creatures.length === 1 ? '' : 's'}}:
        <div class="table-wrapper">
          <table class="surrounds-categories">
            <tbody>
              <tr v-for="(entity, index) in surroundings.creatures"
                  :key="`creature-${index}`"
                  @mouseenter="highlight(entity)"
                  @mouseleave="highlight()">
                <td :style="getStyle(entity.level)" class="symbol">{{entity.symbol}}</td>
                <td class="creature-name">{{entity.name}}</td>
                <td class="creature-level">Level</td>
                <td :style="getStyle(entity.level)">{{entity.level}}</td>
                <td class="direction">
                  (<span :style="entity.dir === 'here' ? getStyle(entity.level) : ''">{{entity.dir}}</span>)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="surrounding-items-wrapper">
        {{surroundings.items.total}} Item{{surroundings.items.total === 1 ? '' : 's'}}:
        <div class="table-wrapper">
          <div class="surrounds-categories">
              <div v-for="(item, i) in surroundings.items.stacked"
                  :key="`item-${i}`"
                  @mouseenter="highlight(null, item.locations)"
                  @mouseleave="highlight()"
                  @click.left="toggleExpanded(item)"
                  class="item-list-wrapper">
                <span class="item-count">{{item.count}}</span>
                <span class="item-name">{{item.count === 1 ? item.name : item.plural}}</span>
                  <div v-for="(expanded, i) in item.expanded"
                      :key="`expanded-${i}`"
                      @mouseenter="highlight(null, expanded.loc)"
                      @mouseleave="highlight()"
                      v-show="expandedItem === item.name"
                      class="expanded-items">
                    <span class="item-count">{{expanded.count}}</span>
                    <span class="expanded-name">
                      {{expanded.count === 1 ? expanded.name : expanded.plural}}
                    </span>
                    <span class="item-value">{{expanded.totalValue}}</span>
                    <span class="direction">({{expanded.dir}})</span>
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import display from "../game/overview/Display";
import { levelColour } from "../game/utils/colours";

export default {
  data() {
    return {
      expandedItem: "",
    };
  },
  computed: {
    worldExists() {
      return this.$store.getters.worldExists;
    },
    surroundings() {
      return this.$store.getters.surroundings(2);
    },
  },
  methods: {
    getStyle(lvl) {
      return "color: " + levelColour(lvl);
    },
    toggleExpanded(item) {
      if (item.name === this.expandedItem) {
        this.expandedItem = "";
      } else {
        this.expandedItem = item.name;
      }
    },
    highlight(entity, locations) {
      if (entity) {
        let highlit = {
          [entity.pos]: {
            symbol: entity.symbol,
            colour: entity.isDead() ? "#888" : levelColour(entity.level, 30),
          },
        };
        this.$store.dispatch("highlight", highlit);
      } else if (locations) {
        this.$store.dispatch("highlight", locations);
      } else {
        this.$store.dispatch("highlight");
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
  font-size: 16px;
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
  cursor: default;
}

.surrounds-categories tr:hover {
  background-color: var(--ui-border);
}

.surrounds-categories td {
  padding: 3px 4px;
}

.direction {
  text-align: right;
  text-transform: capitalize;
  width: 110px;
  margin-left: 10px;
}

.wrapper {
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.creatures-wrapper,
.surrounding-items-wrapper {
  /* margin: 16px 8px 20px 15px; */
  margin: 0px 8px 0px 15px;
  flex: 1 1 0;
  max-height: 48%;
}

.table-wrapper {
  margin: 6px 0px 16px;
  max-height: 85%;
  overflow-y: scroll;
}

.symbol {
  font-size: 20px;
  width: 14px;
}

.creature-name {
  font-size: 1.1em;
  text-transform: capitalize;
  width: 100px;
}

.creature-level {
  text-align: right;
  width: 40px;
}

.item-list-wrapper {
  padding: 2px 0px;
  cursor: pointer;
}

.item-name {
  font-size: 1.1em;
  width: 280px;
}

.item-count {
  color: white;
  flex: 0 0 25px;
}

.item-value {
  flex: 0 0 25px;
  color: yellow;
}

.expanded-items {
  background-color: #1e1e1e;
  padding: 2px 0px 2px 10px;
  width: 95%;
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
}

.item-list-wrapper > div:first-of-type {
  margin-top: 3px;
}

.expanded-name {
  margin-right: auto;
}
</style>
