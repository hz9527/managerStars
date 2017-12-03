<template lang="html">
  <div class="search" v-show='show'>
    <input type="text" ref='input' v-model='keyWord' />
    <div class="list" @click='choose'>
      <div class='item' :data-id='item.id' v-for='item in list' :key='item.id'>{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {throttle} from '../utils/utils'
var search = throttle(100)
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    ignoreList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      keyWord: '',
      list: []
    }
  },
  watch: {
    show (v) {
      if (v) {
        this.$refs.input.value = ''
        this.search()
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    },
    keyWord () {
      search(this.search)
    },
    getAllTips (v) {
      this.search()
      this.$emit('tipListChange', v.map(item => item.id))
    },
    ignoreList (v) {
      this.search()
    }
  },
  methods: {
    choose (e) {
      if ('id' in e.target.dataset) {
        let id = e.target.dataset.id
        let item = this.list.find(info => info.id === id)
        this.$emit('choose', item)
      }
    },
    search () {
      let kw = this.keyWord.trim()
      if (kw) {
        this.list = this.getAllTips.filter(item => item.name.indexOf(kw) > -1)
      } else {
        this.list = this.getAllTips.slice()
      }
      if (this.ignoreList.length > 0) {
        this.list = this.list.filter(item => !this.ignoreList.find(id => id === item.id))
      }
    }
  },
  computed: {
    ...mapGetters(['getAllTips'])
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
.search {
  display: inline-block;
  position: relative;
  border: 1px solid $border;
  box-sizing: border-box;
}
.list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid $border;
  border-bottom: 0;
  box-sizing: border-box;
  .item {
    text-align: center;
    cursor: pointer;
    padding: 5px;
    border-bottom: 1px solid $border;
  }
}
</style>
