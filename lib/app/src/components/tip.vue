<template lang="html">
  <div class="tip">
    {{data.name}}
    <b :data-tip='data.id' v-show='type === "edit"' @click='delTip'>del</b>
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
  },
  methods: {
    delTip () {
      this.$emit('delTip', this.data.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  display: inline-block;
}
</style>
