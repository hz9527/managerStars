<template lang="html">
  <div class="">
    test
  </div>
</template>

<script>
import {getUser} from '../API/index'
export default {
  created () {
    this.init()
  },
  methods: {
    init () {
      console.log(getUser)
    }
  }
}
</script>

<style lang="scss">
</style>
