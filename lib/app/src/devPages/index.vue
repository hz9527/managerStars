<template lang="html">
  <div class="">
    test
  </div>
</template>

<script>
import {getUserInfo} from '../API/serve'
import {mapActions} from 'vuex'
export default {
  created () {
    this.init()
  },
  methods: {
    ...mapActions(['setUser', 'setRepo']),
    init () {
      getUserInfo()
        .then(res => {
          if (res.userName && res.repository) {
            this.setUser(res.userName)
            this.setRepo(res.repository)
          } else {
            this.$router.push({name: 'login'})
          }
        })
    }
  }
}
</script>

<style lang="scss">
</style>
