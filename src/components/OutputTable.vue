<template>
  <table id="output-table">
  </table>
</template>

<script>
export default {};
</script>

<style>
#output-table > tr > .entity {
  /*grid-area: entity;*/
  width: 140px;
  vertical-align: top;
  padding: 3px 10px;
  color: var(--text-blur);
  background-color: var(--ui-dark);
  text-transform: capitalize;
}

#output-table > tr > .messages {
  /*grid-area: messages;*/
  width: 1fr;
  vertical-align: top;
  padding: 3px 10px;
  margin: none;
  color: var(--text);
  background-color: var(--ui);
}
</style>
