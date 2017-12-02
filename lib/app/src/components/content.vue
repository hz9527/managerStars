<template lang="html">
  <div class="content">
    <item v-for='item in getList' :data='item' :key='item.id' />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Item from './item'
export default {
  computed: {
    ...mapGetters(['getList'])
  },
  components: {
    Item
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  overflow: auto;
}
</style>
