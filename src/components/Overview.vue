<template>
  <div id="overview" @click="resizeOverview">
    <!-- <canvas width="400" height="400" id="overview-canvas">
      Canvas unsupported, use a newer browser.
    </canvas> -->
  </div>
</template>

<script>
import DisplayMap from "../game/utils/DisplayMap";
import * as ROT from "rot-js";
import _ from "lodash";

export default {
  data() {
    return {
      display: new ROT.Display({
        fontSize: 10,
        fg: "#daddd8",
        bg: "#1e1e1e",
        forceSquareRatio: true
      })
    }
  },
  mounted() {
    // DisplayMap();

    document.querySelector("#overview").appendChild(this.display.getContainer());

    this.resizeOverview();

    window.addEventListener("resize", _.debounce(this.resizeOverview, 100));
  },
  methods: {
    resizeOverview() {
      let overviewDiv = document.querySelector("#overview");

      this.display.setOptions({
        width: ~~(overviewDiv.offsetWidth / 10),
        height: ~~(overviewDiv.offsetHeight / 10)
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
