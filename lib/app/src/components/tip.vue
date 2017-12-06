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
  padding: 3px 5px;
  margin: 0 5px 0 0;
  background: #f55;
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
}
</style>
