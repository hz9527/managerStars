<template lang="html">
  <div class="item">
    <div class="item-left">
      <div class="item-name hz-ellipsis">项目名: {{data.name}}</div>
      <div class="item-ower">作者: {{data.ower}}</div>
    </div>
    <div class="item-right">

    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
}
.item-left, .item-right {
  flex-grow: 0;
}
.item-left {
  width: 40%;
  overflow: hidden;
}
.item-right {
  width: 60%;
  background: #f55;
}
</style>
