<template>
  <div id="overview">
  </div>
</template>

<script>
import _ from "lodash";
import display from "../game/overview/Display.js";

export default {
  mounted() {
    document.querySelector("#overview").appendChild(display.getContainer());

    this.resizeOverview();

    window.addEventListener("resize", _.debounce(this.resizeOverview, 100));
  },
  methods: {
    resizeOverview() {
      let overviewDiv = document.querySelector("#overview");

      display.setOptions({
        width: ~~(overviewDiv.offsetWidth / display._options.fontSize),
        height: ~~(overviewDiv.offsetHeight / display._options.fontSize)
      });
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
