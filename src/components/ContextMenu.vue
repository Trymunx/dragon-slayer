<template>
  <div class="context-menu">
      <li>1st item</li>
      <li>longer item goes here</li>
      <li>3rd item</li>
      <li>1st item</li>
      <li>longer item goes here</li>
      <li>3rd item</li>
      <li>1st item</li>
      <li>longer item goes here</li>
      <li>3rd item</li>
  </div>
</template>

<script>
export default {};
</script>

<style>
.context-menu {
  position: absolute;
  max-width: 160px;
  color: var(--text-blur);
  background: var(--ui-border);
  padding: 10px;
  z-index: 1;
  border-radius: 5px;
  box-shadow: 0px 2px 15px -1px black;
}
</style>
