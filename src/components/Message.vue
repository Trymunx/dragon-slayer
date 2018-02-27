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
  display: flex;
  flex-shrink: 0;
  overflow-y: auto;
  min-width: 500px;
}

.messages:last-child {
  flex-grow: 1;
}

.entity {
  flex: 0 0 160px;
  padding: 3px 10px;
  color: var(--text-blur);
  background-color: var(--ui-dark);
  text-transform: capitalize;
}

.message {
  flex: 1 1;
  padding: 3px 10px;
  margin: none;
  color: var(--text);
  background-color: var(--ui);
}
</style>
