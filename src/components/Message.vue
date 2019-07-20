<template>
  <div class="messages" @click.right.stop.prevent="showContextMenu">
    <div class="entity">{{entity}}</div>
    <div class="message" v-html="message"></div>
  </div>
</template>

<script>
export default {
  methods: {
    contextMenuItems(vm) {
      return [
        {
          action: () => {
            vm.$store.dispatch("setInputText",
              vm.message
            );
          },
          text: "Resend message",
        },
        {
          action: () => {
            let entityName;
            if (vm.entity.split(" ").length > 1) {
              entityName = `@'${vm.entity}'`;
            } else {
              entityName = `@${vm.entity}`;
            }
            vm.$store.dispatch("setInputText", `${entityName} `);
          },
          text: `Reply to ${vm.entity}`,
        },
        {
          action: () => {
            console.log("TODO: pass more than just the name into the message to inspect.");
          },
          text: `Inspect ${vm.entity}`,
        },
      ];
    },
  },
  props: ["entity", "message"],
};
</script>

<style>
.messages {
  display: flex;
  flex-shrink: 0;
  overflow-x: hidden;
}

.messages:first-child > div {
  padding-top: 8px;
}

.messages:hover .entity {
  color: var(--text);
  background-color: var(--ui-darker);
}

.messages:hover .message {
  background-color: var(--ui-dark);
}

.entity {
  flex: 0 0 140px;
  padding: 3px 10px;
  color: var(--text-blur);
  background-color: var(--ui-dark);
  text-transform: capitalize;
  white-space: pre-wrap;
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
  white-space: pre-wrap;
}
</style>
