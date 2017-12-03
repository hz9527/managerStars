<template lang="html">
  <div class="panel">
    <div class="action">
      <!-- choose -->
      {{getTotalCount}}
    </div>
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
        <hz-select :list='getLangList' @choose='chooseSel("lang", $event)' :choose='chooseLang'/>
      </div>
      <div class="sort-con">
        <hz-select :list='sortList' @choose='chooseSel("sort", $event)' :choose='chooseSort'/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import HzSelect from './select'
const SortConf = [
  {id: 0, name: 'star时间'},
  {id: 1, name: 'issues数'},
  {id: 2, name: '创建时间'},
  {id: 3, name: '更新时间'},
  {id: 4, name: 'star数'},
  {id: 5, name: 'fork数'}
]
export default {
  props: {
    type: {
      typs: String,
      default: 'prod'
    }
  },
  data () {
    return {
      chooseLang: 0,
      chooseSort: 0,
      sortList: SortConf
    }
  },
  computed: {
    ...mapGetters(['getTab', 'getTotalCount', 'getChooseCount', 'getLangList'])
  },
  methods: {
    ...mapMutations(['setKeyWord', 'setLang', 'setSort', 'chooseAll', 'unChooseAll']),
    ...mapActions(['chooseTab']),
    chooseSel (type, ind) {
      if (type === 'lang') {
        this.chooseLang = ind
        this.setLang(ind === 0 ? -1 : this.getLangList[ind])
      } else if (type === 'sort') {
        this.chooseSort = ind
        this.setSort(this.sortList[ind].id)
      }
    }
  },
  components: {HzSelect}
}
</script>

<style lang="scss" scoped>
.tab-active {
  color: #f55;
}
</style>
