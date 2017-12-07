<template lang="html">
  <transition name='toast'>
    <div class="toast" v-show='show'>
      {{text}}
    </div>
  </transition>
</template>

<script>
import {Bus} from '../vueUtil'
const showTime = 2000
const nextShow = 1300
let loop = []
export default {
  data () {
    return {
      text: '',
      show: false
    }
  },
  created () {
    Bus.$on('toast', text => {
      if (this.show || loop.length > 0) {
        loop.push(text)
      } else {
        this.text = text
        this.show = true
      }
    })
  },
  watch: {
    show (v) {
      if (v) {
        setTimeout(() => {
          this.show = false
        }, showTime)
      } else if (!v && loop.length > 0) {
        setTimeout(() => {
          this.text = loop.shift()
          this.show = true
        }, nextShow)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/rule.scss';
.toast {
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 5px 30px;
  background: $warnBg;
  text-align: center;
  line-height: 15px;
  color: $main;
}
.toast-enter-active, .toast-leave-active {
  transition: 0.7s;
}
.toast-enter, .toast-leave-to {
  opacity: 0;
  transform: translate(0, -100%);
}
</style>
