<template lang="html">
  <div class="select">
    <div class="choose" @click='toggle'>{{curName}}</div>
    <div class="choose-con" v-show='showList' @click='chooseItem'>
      <div class="item" :data-ind='ind' v-for='(item, ind) in curList' :key='item.key'>{{item.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    keys: {
      type: Object, // {key xx name xx}
      default () {
        return {key: 'id', name: 'name'}
      }
    },
    choose: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showList: false
    }
  },
  computed: {
    curList () {
      return this.list.map(item => {
        if (typeof item !== 'object' || item === null) {
          return {
            key: item || '无',
            name: item || '无'
          }
        } else {
          return {
            key: item[this.keys.key],
            name: item[this.keys.name]
          }
        }
      })
    },
    curName () {
      if (this.curList.length > 0) {
        return this.curList[this.choose].name
      } else {
        return ''
      }
    }
  },
  methods: {
    toggle () {
      this.showList = !this.showList
    },
    chooseItem (e) {
      if ('ind' in e.target.dataset) {
        this.$emit('choose', Number(e.target.dataset.ind))
        this.showList = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select {
  display: inline-block;
  width: 100px;
  border: 1px solid #f55;
  position: relative;
  text-align: center;
}
.choose-con {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  margin: 1px 0 0 -1px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #f55;
  border-top: 0;
  cursor: pointer;
  z-index: 100;
}
.item {
  padding: 0 3px;
  border-bottom: 1px solid #f55;
  position: relative;
  &:last-child {
    border: 0;
  }
  &:hover {
    top: -2px;
  }
}
</style>
