<template lang="html">
  <div class="panel">
    <div class="action">
      <choose :choose='getTotalCount === getChooseCount && getChooseCount > 0' @toggle='toggleChoose' />
      {{getTotalCount}}
      {{getChooseCount}}
      <batch-tip @save='editTips("addTips", $event)' />
      <batch-tip @save='editTips("delTips", $event)' />
      <batch-tip @save='editTips("editTips", $event)' />
    </div>
    <div class="filter">
      <div class="tab-con" @click='chooseTab'>
        <div data-ind='0' :class="['tab-item', getTab === 0 ? 'tab-active' : '']">全部</div>
        <div data-ind='1' :class="['tab-item', getTab === 1 ? 'tab-active' : '']">已有tip</div>
        <div data-ind='2' :class="['tab-item', getTab === 2 ? 'tab-active' : '']">无tip</div>
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
import Choose from './radio'
import BatchTip from './batchTip'
import {Bus} from '../vueUtil/index'
import {getBatchResult} from '../utils/dealBatch'
import {listSaveTips} from '../API/serve'
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
      sortList: SortConf,
      curChoose: false
    }
  },
  computed: {
    ...mapGetters(['getTab', 'getTotalCount', 'getChooseList', 'getChooseCount', 'getLangList', 'getAllList'])
  },
  methods: {
    ...mapMutations(['setKeyWord', 'setLang', 'setSort', 'unChooseAll', 'listSaveTips']),
    ...mapActions(['changeTab', 'chooseAll']),
    chooseTab (e) {
      if ('ind' in e.target.dataset) {
        this.changeTab(Number(e.target.dataset.ind))
      }
    },
    chooseSel (type, ind) {
      if (type === 'lang') {
        this.chooseLang = ind
        this.setLang(ind === 0 ? -1 : this.getLangList[ind])
      } else if (type === 'sort') {
        this.chooseSort = ind
        this.setSort(this.sortList[ind].id)
      }
    },
    toggleChoose (v) {
      if (v) {
        this.chooseAll()
      } else {
        this.unChooseAll()
      }
      Bus.$emit('changeChoose', v)
    },
    editTips (type, data) {
      if (this.getChooseCount > 0) {
        this.saveTips(type, data)
      } else {
        // toast
      }
    },
    saveTips (type, tips) {
      let set = new Set(this.getChooseList)
      let result = getBatchResult(type, tips, this.getAllList.filter(item => set.has(item.id)))
      if (result.length === 0) {
        // toast nothing to save
      } else {
        listSaveTips(result)
          .then(() => {
            Bus.$emit(type, tips)
            this.listSaveTips(result)
          })
          .catch(err => console.log(err))
      }
    }
  },
  components: {
    HzSelect,
    Choose,
    BatchTip
  }
}
</script>

<style lang="scss" scoped>
.tab-active {
  color: #f55;
}
</style>
