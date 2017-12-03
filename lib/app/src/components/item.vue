<template lang="html">
  <div class="item">
    <div class="item-first"></div>
    <div class="item-left">
      <div class="item-name">
        <span class="hz-ellipsis">{{data.name}}</span>
        <div class="hz-btn-s">查看</div>
        <div class="hz-btn-s">复制git地址</div>
      </div>
      <div class="item-base">
        作者: <span>{{data.owner}}</span>
        默认分支: <span>{{data.default_branch}}</span>
        主要语言: <span>{{data.language}}</span>
      </div>
      <div class="item-info">
        forks: <span>{{data.forks}}</span>
        stars: <span>{{data.watchers}}</span>
        open_issues: <span>{{data.open_issues}}</span>
      </div>
      <div class="item-time">
        created_at: <span>{{data.created_at | time}}</span>
        updated_at: <span>{{data.updated_at | time}}</span>
      </div>
      <div class="item-desc">{{data.description}}</div>
    </div>
    <div class="item-right">
      <div class="edit">
        <div class="hz-btn-m" @click='editBtn'>{{state === 'normal' ? '编辑' : '保存'}}</div>
        <div class="hz-btn-m" @click='cancelBtn' v-show='state !=="normal"'>取消</div>
      </div>
      <div class="tips">
        <tip :data='tip' :type='"edit"' v-for='tip in allList' :key='tip.id' />
        <add-tip @choose='add' :show='hasAdd && state !== "normal"' :ignoreList='allTipIds' />
        <div class="hz-btn-s" v-show='state !== "normal"' @click='addBtn'>{{hasAdd ? '取消' : '添加'}}</div>
      </div>
      <div class="desc">
        <textarea ref='text' :disabled='state !== "edit"'></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import Tip from './tip'
import AddTip from './search'
import {editItem} from '../API/serve'
import {mapGetters} from 'vuex'
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      default: 'prod'
    }
  },
  data () {
    return {
      state: 'normal', // normal edit loading
      hasAdd: false,
      delList: [], // all in data.tips
      addList: []
    }
  },
  computed: {
    ...mapGetters(['getAllTips']),
    allTipIds () {
      let delSet = new Set(this.delList)
      return this.data.tips.filter(id => !delSet.has(id)).concat(this.addList)
    },
    allList () {
      if (this.allTipIds.length === 0) {
        return []
      }
      return this.getAllTips.filter(item => this.allTipIds.some(id => id === item.id))
    }
  },
  watch: {
    getAllTips (v) {
      let list = v.map(item => item.id)
      if (new Set(list.concat(this.addList)).size > v.length) {
        let set = new Set(list)
        this.addList = this.addList.filter(id => set.has(id))
      }
    }
  },
  mounted () {
    this.$refs.text.value = this.data.desc
  },
  methods: {
    editBtn () {
      if (this.state === 'normal') {
        this.state = 'edit'
      } else if (this.state === 'edit') {
        // save
        this.save()
      }
    },
    cancelBtn () {
      if (this.state === 'edit') {
        this.resetChange()
        this.$refs.text.value = this.data.desc
        this.state = 'normal'
      }
    },
    addBtn () {
      if (this.state === 'edit') {
        this.hasAdd = !this.hasAdd
      }
    },
    add (id) {
      this.hasAdd = false
      if (!this.allTipIds.some(tipId => tipId === id)) {
        this.addList.push(id)
        this.hasAdd = false
      } else {
        // toast
      }
    },
    save () {
      let sendData = JSON.parse(JSON.stringify(this.data))
      let text = this.$refs.text.value.trim()
      let change = false
      if (this.allTipIds.toString() !== this.data.tips.toString()) {
        change = true
        sendData.tips = this.allTipIds.slice()
      }
      if (text !== this.data.desc) {
        change = true
        sendData.desc = text
      }
      if (!change) {
        // toast
        return
      }
      this.state = 'loading'
      editItem(sendData)
        .then(() => {
          this.state = 'normal'
          this.resetChange()
          this.$emit('change', sendData)
        })
        .catch(err => {
          console.log(err)
          this.state = 'normal'
          if (text !== this.data.desc) {
            this.$refs.text.value = this.data.desc
          }
          this.resetChange()
        })
    },
    resetChange () {
      if (this.addList.length > 0) {
        this.addList = []
      }
      if (this.delList.length > 0) {
        this.delList = []
      }
    }
  },
  components: {
    AddTip,
    Tip
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
.item {
  display: flex;
  margin: 5px;
  border-bottom: 1px solid $border;
  padding: 5px 0;
}
.item-left, .item-right {
  width: 50%;
  flex-shrink: 10;
}
.item-first, .item-right{
  flex-shrink: 0;
}
.item-first {
  width: 5%;
}
.item-left {
  .item-name {
    padding: 5px;
    display: flex;
    color: $titColor;
    border-bottom: 1px solid $border;
    .hz-btn-s {
      flex-shrink: 0;
      margin: 3px;
    }
    span {
      font-size: $titSize;
    }
  }
  .item-desc {
    color: $infoColor;
  }
}
.item-right {
  padding: 0 20px;
  .desc textarea {
    width: 100%;
  }
}
</style>
