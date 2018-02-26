<template>
  <div class="messages">
    <div class="entity">{{entity}}</div>
    <div class="message">{{message}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["entity", "message"]
};
</script>

<style>
.messages {
  display: grid;
  grid-template-columns: 160px 1fr;
  grid-template-areas: "entity message";
  overflow-y: auto;
  min-width: 500px;
}

.entity {
  grid-area: entity;
  width: 140px;
  vertical-align: top;
  padding: 3px 10px;
  color: var(--text-blur);
  background-color: var(--ui-dark);
  text-transform: capitalize;
}

.message {
  grid-area: message;
  width: 1fr;
  vertical-align: top;
  padding: 3px 10px;
  margin: none;
  color: var(--text);
  background-color: var(--ui);
}
</style>
