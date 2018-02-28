<template>
  <div id="inventory">Inventory</div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
#inventory {
  padding: 10px;
  overflow-y: auto;
  color: var(--text-blur);
  background-color: var(--ui-darker);
  border-color: var(--ui-border);
  font-family: "Ubuntu Mono", monospace;
  font-size: 0.85em;
  white-space: pre-wrap;
}

#inventory::-webkit-scrollbar {
  width: 8px;
}

#inventory::-webkit-scrollbar-track {
  background-color: var(--ui-darker);
}

#inventory::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
</style>
