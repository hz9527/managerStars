<template lang="html">
  <div class="hz-page">
    <hz-aside class='hz-aside' />
    <div class="hz-content">
      <ctrl-panel />
      <hz-content />
    </div>
  </div>
</template>

<script>
import {getUserInfo, getTipList, getList} from '../API/serve'
import {mapMutations} from 'vuex'
import HzAside from '../components/aside.vue'
import CtrlPanel from '../components/ctrlPanel.vue'
import HzContent from '../components/content.vue'
export default {
  created () {
    this.init()
  },
  methods: {
    ...mapMutations(['setUser', 'setRepo', 'setImg', 'setInitValue']),
    init () {
      getUserInfo()
        .then(res => {
          if (res.userName && res.repository) {
            this.setUser(res.userName)
            this.setRepo(res.repository)
            this.setImg(res.img)
            // get tips & list
            Promise.all([getTipList(), getList()])
              .then(resList => {
                console.log(resList[1])
                this.setInitValue({key: 'allTips', value: resList[0]})
                this.setInitValue({key: 'allList', value: resList[1]})
              })
          } else {
            this.$router.push({name: 'login'})
          }
        })
    }
  },
  components: {
    HzAside,
    CtrlPanel,
    HzContent
  }
}
</script>

<style lang="scss">
</style>
