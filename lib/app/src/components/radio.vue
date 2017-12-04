<template lang="html">
  <span @click='toggle'>{{choose}}</span>
</template>

<script>
export default {
  props: {
    choose: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle () {
      this.$emit('toggle', !this.choose)
    }
  }
}
</script>

<style lang="scss">
</style>
