<template>
  <div id="overview" @click.right.stop.prevent="showContextMenu">
  </div>
</template>

<script>
import _ from "lodash";
import display from "../game/overview/Display";

export default {
  methods: {
    contextMenuItems(vm, items, event) {
      let pos = { x: event.x, y: event.y };
      let canvas = document.querySelector("#overview > canvas");
      let dOpts = display.getOptions();
      let displayX = Math.floor((pos.x - canvas.offsetLeft) * dOpts.width / canvas.offsetWidth);
      let displayY = Math.floor((pos.y - canvas.offsetTop) * dOpts.height / canvas.offsetHeight);
      let displayOrigin = this.$store.getters.displayOrigin;
      let creaturesOnTile = this.$store.getters.creaturesAt(
        displayX + displayOrigin.x,
        displayY + displayOrigin.y
      ) || [];
      let itemsOnTile = this.$store.getters.world.getTile(
        displayX + displayOrigin.x,
        displayY + displayOrigin.y
      ).items || [];

      creaturesOnTile = creaturesOnTile.map(creature => {
        return {
          action: () => {
            if (creature.isDead()) {
              this.$store.dispatch("addMessage", {
                entity: `Examine ${creature.name}:`,
                message: `The ${creature.name} is dead.`,
              });
            } else {
              const itemDrops = creature.getItemsPrettyOutput();
              this.$store.dispatch("addMessage", {
                entity: `Examine ${creature.name}:`,
                message: `The ${creature.name} is level ${creature.level} and has ` +
                  `${creature.hp}HP. It will drop ${itemDrops || "nothing"}.`,
              });
              this.$store.dispatch("addMessage", {
                entity: "",
                message: creature.getHPReport(),
              });
            }
          },
          text: `Examine ${creature.isDead() ? "dead" : ""} ${creature.name}`,
        };
      });

      itemsOnTile = itemsOnTile.reduce((arr, item) => {
        let val = arr.find(el => el.name === item.name);
        if (val) {
          val.count++;
          val.val += item.val;
          val.text = `${val.count} ${val.count === 1 ? val.name : val.plural} (${val.val})`;
          val.action = () => console.log(val);
        } else {
          let newItemEntry = {
            // Have to use old school function so that this points to this object
            action: function() {
              console.log(this);
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
        let overviewDiv = document.querySelector("#overview");
        let [width, height] =
          display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);

        display.setOptions({ height, width });
        display.drawWorld();
      }
    },
  },
  mounted() {
    document.querySelector("#overview").appendChild(this.$game.display.getContainer());

    window.addEventListener("resize", _.debounce(this.resizeOverview, 100));
  },
};
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
