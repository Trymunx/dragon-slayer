<template>
  <div id="output">
    <message v-for="(msg, i) in messages" :entity="msg.entity" :message="msg.message" :key="i"/>
    <div id="messagebg">
      <div class="entity"/>
      <div class="message"/>
    </div>
  </div>
</template>

<script>
import Message from "./Message";

export default {
  computed: {
    messages() {
      return this.$store.getters.messages;
    }
  },
  components: {
    Message
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#output {
  display: flex;
  flex-flow: column;
  overflow-y: auto;
}

#messagebg {
  flex-grow: 1;
  display: flex;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
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
</style>
