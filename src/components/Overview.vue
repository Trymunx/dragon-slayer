<template>
  <div id="overview">
    <canvas width="400" height="400" id="overview-canvas">
      Canvas unsupported, use a newer browser.
    </canvas>
  </div>
</template>

<script>
export default {};
</script>

<style>
#overview-canvas {
  background-color: var(--ui-darker);
}

#overview {
  padding: 5px;
  margin-bottom: 2px;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.9em;
  white-space: pre-wrap;
  text-align: center;
  overflow-y: auto;
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
