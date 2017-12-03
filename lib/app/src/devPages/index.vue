<template lang="html">
  <div class="hz-page">
    <hz-aside type='dev' class='hz-aside' />
    <div class="hz-content">
      <ctrl-panel type='dev' class="panel" />
      <hz-content type='dev' />
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
.hz-content {
  display: flex;
  flex-direction: column;
}
.panel {
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
