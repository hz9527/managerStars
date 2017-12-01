<template lang="html">
  <div class="">
  </div>
</template>

<script>
import {getUserInfo} from '../API/serve'
import {mapGetters} from 'vuex'
export default {
  created () {
    this.init()
  },
  computed: {
    ...mapGetters(['getList'])
  },
  methods: {
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
