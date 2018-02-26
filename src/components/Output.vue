<template>
  <div id="output">
    <message v-for="(msg, i) in messages" :entity="msg.entity" :message="msg.message" :key="i"/>
    <!-- <div id="messagesBg"></div> -->
  </div>
</template>

<script>
import Message from "./Message";

export default {
  data() {
    return {
      messages: [
        { entity: "Alpvax", message: "I'm helping you develop your game." },
        { entity: "p-Dandy", message: "I'm fixing your broken shit." },
        {
          entity:
            "This is a really long name that should break over a few lines",
          message:
            "I'm trying to help fix your broken shit. I'm trying to help fix your broken shit. I'm trying to help fix your broken shit. I'm trying to help fix your broken shit. I'm trying to help fix your broken shit."
        },
        { entity: "Me", message: "Thanks guys." }
      ]
    };
  },
  components: {
    Message
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#output {
  grid-area: output;
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
