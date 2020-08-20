<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from '../src/components/m-header/m-header'
import Tab from '../src/components/tab/tab'

export default {
  components: {
    MHeader,
    Tab
  }
}
</script>

<style lang="stylus">
  @import 'common/stylus/variable.styl'

  // #app
  //   color: $color-theme

</style>
