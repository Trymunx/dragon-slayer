<template>
  <div class="messages"><!-- @mouseover="hovered=true" @mouseout="hovered=false" :class="{hovered: hovered}"> -->
    <div class="entity">{{entity}}</div>
    <div class="message">{{message}}</div>
  </div>
</template>

<script>
export default {
  data() { return {hovered: false}},
  props: ["entity", "message"]
};
</script>

<style>
.messages {
  display: flex;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/*.messages:last-child {
  flex-grow: 1;
}*/

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

.messages:hover div {
  background-color: var(--ui-darker);
}

</style>
