<template lang="html">
  <div class="content">
    <item v-for='item in getList' :data='item' :key='item.id' @change='changeItem' />
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import Item from './item'
export default {
  computed: {
    ...mapGetters(['getList'])
  },
  methods: {
    ...mapMutations(['editItem']),
    changeItem (data) {
      this.editItem(data)
    }
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
