<template>
  <div id="context-menu" ref="menu" :style="style">
    <div v-for="(item, i) in items" :key="i">
      <div @click.stop="handleAction(item)" class="context-item">
        {{item.text}}
      </div>
    </div>
  </div>
</template>

<script>
export const mixin = {
  methods: {
    showContextMenu(event) {
      let pos = { x: event.x, y: event.y };
      var items = [];
      let comp = this;
      while (comp) {
        let e = comp.contextMenuItems(comp, items);
        items = [].concat(items, e);
        comp = comp.$parent;
      }
      this.$store.dispatch("showContextMenu", { pos, items });
    },
    contextMenuItems(vm, menuItems) {
      return menuItems.map(v => v.text).includes("WhoAmI?")
        ? []
        : [
            {
              text: "WhoAmI?",
              action: () => {
                console.log(vm);
              }
            }
          ];
    }
  }
};
export default {
  props: ["items", "pos"],
  data() {
    return {
      style: {
        top: 0,
        left: 0
      }
    };
  },
  watch: {
    pos(newPos) {
      this.updateStyle(newPos.x, newPos.y);
    }
  },
  methods: {
    updateStyle(posX, posY) {
      const { offsetWidth, offsetHeight } = document.getElementById(
        "context-menu"
      ) || { offsetWidth: 0, offsetHeight: 0 };
      this.style = {
        left:
          posX + offsetWidth < window.innerWidth
            ? `${posX}px`
            : `${posX - offsetWidth}px`,
        top:
          posY + offsetHeight < window.innerHeight
            ? `${posY}px`
            : `${posY - offsetHeight}px`
      };
    },
    handleAction(item) {
      if (item.isParent) {
        item.action();
      } else {
        item.action();
        this.$store.dispatch("hideContextMenu");
      }
    }
  }
};
</script>

<style>
#context-menu {
  position: absolute;
  max-width: 160px;
  max-height: 90vh;
  color: var(--text-blur);
  background: var(--ui-border);
  padding: 10px 0px;
  z-index: 1;
  border-radius: 4px;
  box-shadow: 0px 2px 15px 0px #232323;
}

.context-item {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

.context-item:hover {
  background: var(--ui-dark);
}
</style>
