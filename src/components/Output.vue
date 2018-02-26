<template>
  <div id="output">
    <div id="messagesBg"></div>
    <output-table/>
  </div>
</template>

<script>
import OutputTable from "./OutputTable";

export default {
  data() {
    return {};
  },
  components: {
    OutputTable
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
:root {
  /* UI colours */
  --ui: #333231;
  --ui-darker: #262626;
  --ui-border: #1e1e1e;
  --ui-dark: #2b2b2b;
  /* Text colours */
  --text: #daddd8;
  --text-blur: #bababa;
}

#output {
  grid-area: output;
  display: grid;
  grid-template-columns: 160px 1fr;
  grid-template-areas: "entity messages";
  overflow-y: auto;
  min-width: 500px;
}

#output::-webkit-scrollbar {
  width: 8px;
}

#output::-webkit-scrollbar-track {
  background-color: var(--ui-dark);
}

#output::-webkit-scrollbar-thumb {
  background-color: var(--ui-border);
}
#messagesBg {
  grid-column: 2;
  grid-row: 1;
  background-color: var(--ui);
  width: 100%;
  height: 100%;
}
</style>
