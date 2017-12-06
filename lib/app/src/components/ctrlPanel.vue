<template lang="html">
  <div class="ctrl-panel">
    <div class="action">
      <choose :choose='getTotalCount === getChooseCount && getChooseCount > 0' @toggle='toggleChoose' />
      <div class="counts">
        {{getTotalCount}} / {{getChooseCount}}
      </div>
      <batch-tip class='brach-tip' @save='editTips("addTips", $event)' />
      <batch-tip class='brach-tip' @save='editTips("delTips", $event)' />
      <batch-tip class='brach-tip' @save='editTips("editTips", $event)' />
    </div>
    <div class="filter">
      <div class="tab-con" @click='chooseTab'>
        <div data-ind='0' :class="['tab-item', getTab === 0 ? 'tab-active' : '']">全部</div>
        <div data-ind='1' :class="['tab-item', getTab === 1 ? 'tab-active' : '']">已有tip</div>
        <div data-ind='2' :class="['tab-item', getTab === 2 ? 'tab-active' : '']">无tip</div>
      </div>
      <div class="search-con">
        <input type="text" ref='keyWord' placeholder='请输入关键字'/>
        <div class="hz-btn-m" @click='search'>搜索</div>
      </div>
      <div class="sel-con">
        <hz-select :list='getLangList' @choose='chooseSel("lang", $event)' :choose='chooseLang'/>
      </div>
      <div class="sel-con">
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
    search () {
      let kw = this.$refs.keyWord.value.trim()
      console.log(kw)
      kw && this.setKeyWord(kw)
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
@import '../styles/rule.scss';
.ctrl-panel {
  background: #eee;
  margin: 20px 20px 20px 0;
  padding: 15px 0 15px 10px;
}
.action {
  display: flex;
  align-items: flex-start;
  .counts {
    margin: 0 20px 0 10px;
  }
  .brach-tip {
    margin-left: 20px;
  }
}
.filter {
  display: flex;
  margin: 20px 0 0;
  padding-left: 20px;
  align-items: flex-start;
  .tab-con {
    margin-right: 30px;
    display: flex;
    height: 30px;
    line-height: 30px;
    .tab-item {
      padding: 0 20px;
      border: 1px solid $border;
      cursor: pointer;
      &:hover {
        color: $main;
      }
      &:first-child {
        border-right: 0;
      }
      &:last-child {
        border-left: 0;
      }
    }
    .tab-active {
      color: #fff;
      background: $main;
      border-color: $main;
      &:hover {
        color: #fff;
        background: $mainHover;
        border-color: $mainHover;
      }
    }
  }
  .search-con {
    margin-right: 30px;
  }
  .sel-con {
    margin: 0 20px 0 10px;
  }
}
</style>
