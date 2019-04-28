<template>
  <div id="overview" @click.right.stop.prevent="showContextMenu">
  </div>
</template>

<script>
import _ from "lodash";
import display from "../game/overview/Display";

export default {
  mounted() {
    document.querySelector("#overview").appendChild(this.$game.display.getContainer());

    window.addEventListener("resize", _.debounce(this.resizeOverview, 100));
  },
  methods: {
    resizeOverview() {
      if (!this.$store.getters.splash) {
        let overviewDiv = document.querySelector("#overview");
        let [width, height] =
          display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);

        display.setOptions({ width, height });
        display.drawWorld();
      }
    },
    contextMenuItems(vm, items, event) {
      let pos = { x: event.x, y: event.y };
      let canvas = document.querySelector("#overview > canvas");
      let dOpts = display.getOptions();
      let displayX = ~~((pos.x - canvas.offsetLeft) * dOpts.width / canvas.offsetWidth);
      let displayY = ~~((pos.y - canvas.offsetTop) * dOpts.height / canvas.offsetHeight);
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
          text: `Examine ${creature.name}`,
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
                message: `The ${creature.name} is level ${creature.level}.`
                + ` It will drop ${itemDrops ? itemDrops : "nothing"}.`,
              });
            }
          },
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
            name: item.name,
            plural: item.plural,
            val: item.val,
            count: 1,
            text: `1 ${item.name} (${item.val})`,
            // Have to use old school function so that this points to this object
            action: function() {console.log(this);},
          };
          arr.push(newItemEntry);
        }
        return arr;
      }, []);

      return [...creaturesOnTile, ...itemsOnTile];
    },
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
