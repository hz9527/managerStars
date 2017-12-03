<template lang="html">
  <div class="tip">
    {{data.name}}
    <b :data-tip='data.id' v-show='type === "edit"'>del</b>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'disable' // disable edit
    },
    data: Object
  }
}
</script>

<style lang="scss" scoped>
.tip {
  display: inline-block;
}
</style>
