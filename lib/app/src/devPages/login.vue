<template lang="html">
  <div class="hz-modal-bg">
    <div class="hz-modal-con">
      <div class="item">
        <div class="item-con">
          <label for="name">github用户名</label>
          <input type="text" @input='changeName' id='name'>
        </div>
        <span>用户不存在</span>
      </div>
      <div class="item">
        <div class="item-con">
          <label for="repo">仓库名</label>
          <input type="text" @input='changeRepo' id='repo'>
        </div>
        <span>仓库已存在</span>
      </div>
      <div class="hz-btn-full">提交</div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapGetters(['getUser', 'getRepo'])
  },
  created () {
  },
  methods: {
    ...mapMutations(['setUser', 'setRepo']),
    changeName () {},
    changeRepo () {}
  }
}
</script>

<style lang="scss" scoped>
.hz-modal-con {
  width: 50%;
}
</style>
