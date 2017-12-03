<template lang="html">
  <div class="panel">
    <div class="filter">
      <div class="tab-con">
        <div :class="['tab-item', getTab === 0 ? 'tab-active' : '']">全部</div>
        <div :class="['tab-item', getTab === 1 ? 'tab-active' : '']">已有tip</div>
        <div :class="['tab-item', getTab === 2 ? 'tab-active' : '']">无tip</div>
      </div>
      <div class="search-con">
        <input type="text" ref='keyWord' />
      </div>
      <div class="lang-con">
        {{getLangList}}
      </div>
      <div class="sort-con">

      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  props: {
    type: {
      typs: String,
      default: 'prod'
    }
  },
  computed: {
    ...mapGetters(['getTab', 'getTotalCount', 'getChooseCount', 'getLangList'])
  },
  methods: {
    ...mapMutations(['setKeyWord', 'setLang', 'setSort', 'chooseAll', 'unChooseAll']),
    ...mapActions(['chooseTab'])
  }
}
</script>

<style lang="scss" scoped>
.tab-active {
  color: #f55;
}
</style>
