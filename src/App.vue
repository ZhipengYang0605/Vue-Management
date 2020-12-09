<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
#app
  min-width 1200px
.el-cascader-menu
  height 300px !important
</style>
