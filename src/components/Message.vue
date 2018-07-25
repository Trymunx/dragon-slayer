<template>
  <div class="messages" @click.right.stop.prevent="showContextMenu">
    <div class="entity">{{entity}}</div>
    <div class="message">{{message}}</div>
  </div>
</template>

<script>
export default {
  props: ["entity", "message"],
  methods: {
    contextMenuItems(vm) {
      return [
        {
          text: "Resend message",
          action: () => {
            vm.$store.dispatch("setInputText",
              vm.message
            );
          }
        },
        {
          text: `Reply to ${vm.entity}`,
          action: () => {
            let entityName;
            if (vm.entity.split(" ").length > 1) {
              entityName = `@'${vm.entity}'`;
            } else {
              entityName = `@${vm.entity}`;
            }
            vm.$store.dispatch("setInputText", `${entityName} `);
          }
        },
        {
          text: `Inspect ${vm.entity}`,
          action: () => {
            console.log("TODO: pass more than just the name into the message to inspect.");
          }
        }
      ];
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

.messages:first-child > div {
  padding-top: 5px;
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
