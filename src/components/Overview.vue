<template>
  <div id="overview">
  </div>
</template>

<script>
import _ from "lodash";

export default {
  mounted() {
    document.querySelector("#overview").appendChild(this.$game.display.getContainer());

    window.addEventListener("resize", _.debounce(this.resizeOverview, 100));
  },
  methods: {
    resizeOverview() {
      if (!this.$game.displaySplash()) {
        let overviewDiv = document.querySelector("#overview");
        let [width, height] =
          this.$game.display.computeSize(overviewDiv.offsetWidth, overviewDiv.offsetHeight);

        this.$game.display.setOptions({width, height});
        this.$game.display.drawWorld();
      }
    }
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
