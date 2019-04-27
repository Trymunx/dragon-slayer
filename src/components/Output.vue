<template>
  <div id="output">
    <message v-for="(msg, i) in messages" :entity="msg.entity" :message="msg.message" :key="i"/>
    <div id="messageBg"><div class="entity"/><div class="message"/></div>
  </div>
</template>

<script>
import Message from "./Message";

export default {
  computed: {
    messages() {
      return this.$store.getters.messages;
    },
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        document.querySelector("#output").lastChild.scrollIntoView();
      });
    },
  },
  components: {
    Message,
  },
  methods: {
    contextMenuItems(vm) {
      return [
        {
          text: "Log vuex",
          action: () => {
            console.log(vm.$store);
          },
        },
        {
          text: "Do Nothing",
          action: () => {},
        },
      ];
    },
  },
};
</script>

<style>
#output {
  display: flex;
  flex-flow: column;
  overflow-y: auto;
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

#messageBg {
  display: flex;
  flex: 1 1;
}
#messageBg div {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
