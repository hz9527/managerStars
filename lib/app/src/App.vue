<template>
  <div id="app">
    <toast/>
    <router-view/>
  </div>
</template>

<script>
import Toast from './components/toast'
export default {
  name: 'app',
  components: {
    Toast
  }
}
</script>

<style lang='scss'>
@import './styles/reset.scss';
@import './styles/common.scss';
</style>
