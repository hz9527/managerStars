<template lang="html">
  <div class="panel">
    <tip :data='item' v-for='(item, i) in tipList' :type='"edit"' :key='item.id' @delTip='delTip(i)'/>
    <search :ignoreList='list' :show='hasAdd' @choose='chooseTip' />
    <div class="hz-btn-s" @click='addBtn'>{{hasAdd ? '取消' : '添加'}}</div>
    <div class="hz-btn-m" @click='saveBtn'>保存</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {Bus} from '../vueUtil/index'
import Search from './search'
import Tip from './tip'
export default {
  data () {
    return {
      list: [],
      hasAdd: false
    }
  },
  computed: {
    ...mapGetters(['getAllTips']),
    tipList () {
      let map = new Map(this.getAllTips.map(item => [item.id, item.name]))
      return this.list.map(id => {
        return {
          id,
          name: map.get(id)
        }
      })
    },
    btnDis () {
      return this.list.length === this.getAllTips.length
    }
  },
  created () {
    Bus.$on('delTip', id => {
      var ind = this.list.findIndex(tid => tid === id)
      if (ind > -1) {
        this.list.splice(ind, 1)
      }
    })
  },
  beforeDestroy () {
    Bus.$off()
  },
  methods: {
    chooseTip (id) {
      this.list.push(id)
      this.hasAdd = false
    },
    delTip (ind) {
      this.list.splice(ind, 1)
    },
    addBtn () {
      if (this.hasAdd) {
        this.hasAdd = false
      } else {
        if (this.btnDis) {
          // toast
          Bus.$emit('toast', '不能继续添加啦～')
        } else {
          this.hasAdd = true
        }
      }
    },
    saveBtn () {
      if (this.hasAdd) {
        this.hasAdd = false
      }
      if (this.list.length > 0) {
        this.$emit('save', this.list)
      } else {
        // toast
        Bus.$emit('toast', '你要干嘛？')
      }
    }
  },
  components: {
    Search,
    Tip
  }
}
</script>

<style lang="scss" scoped>
.panel {

}
</style>
