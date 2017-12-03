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
        <tip :data='tip' :type='"edit"' v-for='tip in data.tips' :key='tip.id' />
        <tip :data='tip' :type='"edit"' v-for='tip in addList' :key='tip.id' />
        <add-tip @choose='add' :show='hasAdd && state !== "normal"' :ignoreList='allTips' @tipListChange='tipChange' />
        <div class="hz-btn-s" v-show='state !== "normal"' @click='addBtn'>{{hasAdd ? '取消' : '添加'}}</div>
      </div>
      <div class="desc">
        <textarea ref='text'></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import Tip from './tip'
import AddTip from './search'
import {editItem} from '../API/serve'
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
      addList: []
    }
  },
  computed: {
    allTips () {
      return this.data.tips.concat(this.addList).map(item => item.id)
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
        this.addList = []
        this.$refs.text.value = this.data.desc
        this.state = 'normal'
      }
    },
    tipChange (list) {
      if (this.addList.some(item => !list.find(id => item.id === id))) {
        this.addList = this.addList.filter(item => list.find(id => item.id === id))
      }
    },
    addBtn () {
      if (this.state === 'edit') {
        this.hasAdd = !this.hasAdd
      }
    },
    add (data) {
      this.hasAdd = false
      let List = this.data.tips.concat(this.addList)
      if (!List.some(tipId => tipId === data.id)) {
        this.addList.push(data)
      } else {
        // toast
      }
    },
    save () {
      let sendData = JSON.parse(JSON.stringify(this.data))
      let text = this.$refs.text.value.trim()
      let change = false
      if (this.addList.length > 0) {
        change = true
        sendData.tips.push(...this.addList)
        sendData.tips = sendData.tips.map(item => item.id)
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
          this.state = 'edit'
          if (this.addList.length > 0) {
            this.addList = []
          }
          this.$emit('change', sendData)
        })
        .catch(err => {
          console.log(err)
          this.state = 'normal'
          if (text !== this.data.desc) {
            this.$refs.text.value = this.data.desc
          }
          if (this.addList.length > 0) {
            this.addList = []
          }
        })
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
