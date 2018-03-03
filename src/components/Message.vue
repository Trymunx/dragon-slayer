<template>
  <div class="messages" @click.right.prevent="showContextMenu">
    <div class="entity">{{entity}}</div>
    <div class="message">{{message}}</div>
  </div>
</template>

<script>
export default {
  props: ["entity", "message"],
  methods: {
    showContextMenu(event) {
      this.$store.dispatch("showContextMenu", {x: event.x, y: event.y});
      let items = [
        {
          text: "Resend message",
          call: () => {
            this.$store.dispatch("addMessage", {
              entity: this.entity,
              message: this.message
            })
          }
        },
        {
          text: "Another context item (does nothing)",
          call: () => {
            console.log("This context item does nothing.")
          }
        },
        {
          text: "Test context item",
          call: () => {
            console.log("This context item does nothing.")
          }
        },
        {
          text: "Context items are cool I guess",
          call: () => {
            console.log("This context item does nothing.")
          }
        },
      ];
      this.$store.dispatch("setContextMenuItems", items);
    }
  }
};
</script>

<style>
.messages {
  display: flex;
  flex-shrink: 0;
  overflow-x: hidden;
}

.messages:hover .entity {
  color: var(--text);
  background-color: var(--ui-darker);
}

.messages:hover .message {
  background-color: var(--ui-dark);
}

.entity {
  flex: 0 0 160px;
  padding: 3px 10px;
  color: var(--text-blur);
  background-color: var(--ui-dark);
  text-transform: capitalize;
}

@media (max-width: 500px) {
  .entity {
    display: none;
  }
}

.message {
  flex: 1 1;
  padding: 3px 10px;
  margin: none;
  color: var(--text);
  background-color: var(--ui);
}
</style>
