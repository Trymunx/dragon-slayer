<template>
  <div id="input-bar">
    > <input type="text" id="input-text" placeholder="_"
     v-model="inputText" @keypress.enter="submit"/>
  </div>
</template>

<script>
export default {
  computed: {
    inputText: {
      get() {
        return this.$store.getters.inputText;
      },
      set(newValue) {
        this.$store.dispatch("setInputText", newValue);
      }
    }
  },
  methods: {
    submit() {
      if (this.inputText !== "") {
        this.$store.dispatch("enterCommand", this.inputText);
      }
    }
  }
};
</script>

<style scoped>
#input-bar {
  padding: 4px 10px 4px 10px;
  color: var(--text);
  background-color: var(--ui-darker);
  font-family: "Ubuntu Mono", monospace;
}

#input-text {
  width: 92%;
  resize: auto;
  padding: 4px 0px 4px 0px;
  border-style: none;
  outline: none;
  background-color: var(--ui-darker);
  /* Text */
  color: var(--text);
  font-size: 0.95em;
  font-family: "Ubuntu Mono", monospace;
  caret-color: var(--text-blur);
}
</style>
