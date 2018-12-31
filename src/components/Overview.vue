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

        display.setOptions({width, height});
        display.drawWorld();
      }
    },
    contextMenuItems(vm, items, event) {
      let pos = {x: event.x, y: event.y};
      let canvas = document.querySelector("#overview > canvas");
      let dOpts = display.getOptions();
      let displayX = ~~((pos.x - canvas.offsetLeft) * dOpts.width / canvas.offsetWidth);
      let displayY = ~~((pos.y - canvas.offsetTop) * dOpts.height / canvas.offsetHeight);
      let displayOrigin = this.$store.getters.displayOrigin;
      let creaturesOnTile = this.$store.getters.creaturesAt(
        displayX + displayOrigin.x,
        displayY + displayOrigin.y
      );
      if (creaturesOnTile && creaturesOnTile.length > 0) {
      return creaturesOnTile.map(creature => {
        return {
          text: `Examine ${creature.name}`,
          action: () => {
            console.log(creature.items);
            let items = creature.items.reduce((acc, item) => {
              if (acc[item.name]) acc[item.name]++;
              else acc[item.name] = 1;
              return acc;
            }, {});
            let outputs = Object.keys(items).map(k => {
              let plural = creature.items.find(el => el.name === k).plural;
              if (items[k] > 1 && plural) {
                return `${items[k]} ${plural}`;
              } else {
                return `${items[k]} ${k}`
              }
            })
            let output = outputs.length > 1
              ? outputs.slice(0, -1).join(", ") + ", and " + outputs.slice(-1)
              : outputs[0];
            this.$store.dispatch("addMessage", {
              entity: `Examine ${creature.name}:`,
              message: `The ${creature.name} is level ${creature.level}.`
                + ` It will drop ${outputs.length !== 0 ? output : "nothing"}.`,
            });
          },
        }
      });
      }
    },
  }
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
