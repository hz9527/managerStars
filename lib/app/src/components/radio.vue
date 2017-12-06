<template lang="html">
  <span :class="['radio', choose ? 'choose' : '']" @click='toggle'></span>
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

<style lang="scss" scoped>
@import '../styles/rule.scss';
.radio {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 4px;
  border: 1px solid $border;
  position: relative;
  &:hover {
    border-color: $main;
  }
}
.choose {
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    margin: -2px;
    border-radius: 2px;
    background: $main;
  }
}
</style>
