<template lang="html">
  <div class="aside">
    <div class="content">

    </div>
    <div class="footer">
      <div class="hz-img">
        <img :src="getImg" />
      </div>
      <div class="info">
        <span>{{getUser}}</span>
        <span>{{getRepo}}</span>
      </div>
      <div class="hz-btn-full">切换用户</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters(['getUser', 'getRepo', 'getImg'])
  }
}
</script>

<style lang="scss" scoped>
.aside {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content {
  flex-grow: 1;
  overflow: auto;
}
.footer {
  flex-grow: 0;
  background: #f55;
}
</style>
