<template lang="html">
  <div :class="['tip', data.id === this.getCurTip ? 'action' : '']" v-show='state !=="hide" && show' @click='changeTip'>
    <input type="text" ref='input'
      :disabled='type === "prod" || state !== "edit"' placeholder='请输入tip名' />
    <div class="btn-con" v-if='type === "dev"'>
      <div class="hz-btn-s" @click.stop='clickFirst'>{{state === 'normal' ? '编辑' : '取消'}}</div>
      <div class="hz-btn-s" @click.stop='clickLast'>{{state === 'normal' ? '删除' : '保存'}}</div>
    </div>
    <b>{{data.counts}}</b>
  </div>
</template>

<script>
// 为方便数据回退，保存及删除网络请求全部交由组件处理，当修改数据成功才通知父组件来更新Store
import {addTip, setTip, delTip} from '../API/serve'
import {mapGetters, mapActions} from 'vuex'
export default {
  props: {
    type: {
      type: String,
      default: 'prod'
    },
    show: {
      type: Boolean,
      default: true
    },
    data: Object // {name id counts}
  },
  data () {
    return {
      state: 'normal' // normal edit loading hide
    }
  },
  watch: {
    show (v) {
      if (v) {
        this.state = 'edit'
        this.$refs.input.value = ''
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    }
  },
  computed: {
    ...mapGetters(['getCurTip'])
  },
  mounted () {
    this.$refs.input.value = this.data.name
  },
  methods: {
    ...mapActions(['chooseTip']),
    changeTip (e) {
      if (!(this.state !== 'normal' && e.target.nodeName === 'INPUT' && this.data.id !== -1)) {
        if (this.data.id !== this.getCurTip) {
          this.chooseTip(this.data.id)
        }
      }
    },
    clickFirst () {
      if (this.state === 'normal') {
        this.edit()
      } else if (this.state === 'edit') {
        this.cancel()
      }
    },
    clickLast () {
      if (this.state === 'normal') {
        this.del()
      } else if (this.state === 'edit') {
        this.save()
      }
    },
    edit () {
      this.state = 'edit'
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    del () {
      this.state = 'hide'
      delTip(this.data.id)
        .then(() => {
          this.$emit('del', this.data.id)
        })
        .catch(err => {
          console.log(err)
          this.$refs.input.value = this.data.name
          this.state = 'normal'
        })
    },
    save () {
      let name = this.$refs.input.value.trim()
      if (name) {
        this.state = 'loading'
        if (this.data.id === -1) {
          addTip(name)
            .then(res => {
              this.state = 'normal'
              this.$emit('save', {id: -1, name: name, newId: res.tipId})
            })
            .catch(err => {
              console.log(err)
              this.state = 'normal'
            })
        } else {
          setTip({id: this.data.id, name: name})
            .then(() => {
              this.saveSuc(name)
            })
            .catch(err => {
              console.log(err)
              this.$refs.input.value = this.data.name
              this.state = 'normal'
            })
        }
      } else {
        // toast
      }
    },
    cancel () {
      if (this.data.id === -1) {
        this.$emit('del', -1)
      } else {
        this.$refs.input.value = this.data.name
        this.state = 'normal'
      }
    },
    saveSuc (name, id) {
      this.state = 'normal'
      this.$emit('save', {
        name: name,
        id: id || this.data.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
.tip {
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid $border;
  &:hover {
    color: $mainHover;
    input[disabled] {
      color: $mainHover;
    }
  }
}
.action {
  color: $main;
  input {
    color: $main;
  }
}

.btn-con {
  display: inline-block;
}
</style>
