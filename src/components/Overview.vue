<template>
  <div id="overview" @click.right.stop.prevent="showContextMenu">
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Creature } from "../game/entities/creatures";
import { display } from "../game/overview/Display";
import { Item } from "../types/item";
import store from "../vuex/store";
import Vue from "vue";

export default Vue.extend({
  methods: {
    contextMenuItems(vm: HTMLElement, items: Item[], event: any) {
      const pos = { x: event.x, y: event.y };
      const canvas = document.querySelector("#overview > canvas") as HTMLCanvasElement;
      if (!canvas) return;
      const dOpts = display.getOptions();
      const displayX = Math.floor((pos.x - canvas.offsetLeft) * dOpts.width / canvas.offsetWidth);
      const displayY = Math.floor((pos.y - canvas.offsetTop) * dOpts.height / canvas.offsetHeight);
      const [displayOriginX, displayOriginY] = this.$store.getters.displayOrigin;
      console.log(displayOriginX, displayOriginY);

      const creaturesOnTile = this.$store.getters.creaturesAt(
        displayX + displayOriginX,
        displayY + displayOriginY,
      ).map((creature: Creature) => {
        return {
          action: () => {
            if (creature.isDead()) {
              this.$store.dispatch("addMessage", {
                entity: `Examine ${creature.species.name}:`,
                message: `The ${creature.species.name} is dead.`,
              });
            } else {
              const itemDrops = creature.getItemsPrettyOutput();
              this.$store.dispatch("addMessage", {
                entity: `Examine ${creature.species.name}:`,
                message: `The ${creature.species.name} is level ${creature.level} and has ` +
                  `${creature.hp.current}HP. It will drop ${itemDrops || "nothing"}.`,
              });
              this.$store.dispatch("addMessage", {
                entity: "",
                message: creature.printHPReport(true),
              });
            }
          },
          text: `Examine ${creature.isDead() ? "dead" : ""} ${creature.species.name}`,
        };
      });

      interface ExamineItem {
        action: () => void;
        count: number;
        name: string;
        plural: string;
        text: string;
        val: number;
      }

      const itemsOnTile = this.$store.getters.itemsOnTile(
        displayX + displayOriginX,
        displayY + displayOriginY,
      ).reduce((arr: ExamineItem[], item: Item) => {
        const val = arr.find(el => el.name === item.name);
        if (val) {
          val.count++;
          val.val += item.val;
          val.text = `${val.count} ${val.count === 1 ? val.name : val.plural} (${val.val})`;
          val.action = () => {
            store.dispatch("addMessage", {
              entity: "",
              message: `You examine the ${val.plural}. It is worth ${val.val} gold.`,
            });
          };
        } else {
          let newItemEntry = {
            action: () => {
              store.dispatch("addMessage", {
                entity: "",
                message: `You examine the ${item.name}. It is worth ${item.val} gold.`,
              });
            },
            count: 1,
            name: item.name,
            plural: item.plural,
            text: `1 ${item.name} (${item.val})`,
            val: item.val,
          };
          arr.push(newItemEntry);
        }
        return arr;
      }, []);

      return [...creaturesOnTile, ...itemsOnTile];
    },
    resizeOverview() {
      if (!this.$store.getters.splash) {
        let overviewDiv = document.querySelector("#overview") as HTMLDivElement;
        if (!overviewDiv) return;
        let [width, height] =
          display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);

        display.setOptions({ height, width });
        display.drawWorld();
      }
    },
  },
  mounted() {
    document.querySelector("#overview")!.appendChild(display.getContainer()!);

    window.addEventListener("resize", _.debounce(this.resizeOverview, 100));
  },
});
</script>

<style>
#overview-canvas {
  background-color: var(--ui-darker);
}

#overview {
  color: var(--text-blur);
  /* background-color: #47681D; */
  background-color: #1e1e1e;
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.9em;
  white-space: pre-wrap;
  text-align: center;
  overflow-y: auto;

  display: flex;
  justify-content: center;
  align-items: center;
}

#overview::-webkit-scrollbar {
  width: 8px;
}

#overview::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#overview::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>
