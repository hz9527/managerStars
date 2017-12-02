<template lang="html">
  <div class="aside">
    <div class="content">
      <tip-item :data='allTips' />
      <tip-item :type='type' :data='item' v-for='item in getTips'
       :key='item.id' @del='delItem' @save='saveItem' />
      <div class="add-tip hz-btn-b" @click='addItem'>添加标签</div>
    </div>
    <div class="footer">
      <div class="hz-img">
        <img :src="getImg" />
      </div>
      <div class="info">
        <span>{{getUser}}</span>
        <span>{{getRepo}}</span>
      </div>
      <div class="hz-btn-full">切换用户</div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import TipItem from './tipItem'
export default {
  props: {
    type: {
      type: String,
      default: 'dev'
    }
  },
  data () {
    return {
      _addState: 0 // 1 is has add
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getRepo', 'getImg', 'getTips']),
    allTips () {
      return {
        name: '全部标签',
        id: 0,
        counts: this.getTips.length
      }
    }
  },
  methods: {
    ...mapMutations(['addTip', 'delTip', 'setTip']),
    addItem () {
      if (this._addState) {
        // toast
      } else {
        this._addState = 1
        this.addTip({id: -1, name: ''})
      }
    },
    delItem (id) {
      this.delTip(id)
      if (id === -1) {
        this._addState = 0
      }
    },
    saveItem (data) {
      if (data.newId) {
        this._addState = 0
      }
      this.setTip(data)
    }
  },
  components: {
    TipItem
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
.aside {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content {
  flex-grow: 1;
  overflow: auto;
  padding: 20px 0;
  .add-tip {
    margin-top: 20px;
  }
}
.footer {
  flex-grow: 0;
  padding: 10px 0 30px;
  border-top: 1px solid $border;
}
</style>
