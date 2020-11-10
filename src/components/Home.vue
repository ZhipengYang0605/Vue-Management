<template>
  <div id="home">
    <el-container>
      <!-- 头部 -->
      <el-header class="header-wrapper">
        <div class="icon-wrapper">
          <img src="./../assets/logo.png"
               alt="">
          <span class="icon-text">YYY管理系统</span>
        </div>
        <el-button type="info"
                   @click="loginOut">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'"
                  class="asider-wrapper">
          <div class="toggle-botton"
               @click="handleToggle">|||</div>
          <!-- :default-active="activePath" -->
          <el-menu unique-opened
                   :collapse="isCollapse"
                   :collapse-transition="false"
                   background-color="#333744"
                   text-color="#fff"
                   router
                   :default-active="activePath"
                   active-text-color="#409FFF">
            <el-submenu :index="item1.id+''"
                        v-for="item1 in menuList"
                        :key="item1.id">

              <!-- 一级菜单 -->
              <template slot="title">
                <i :class="iconObj[item1.id]"></i>
                <span>{{item1.authName}}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+item2.path"
                            v-for="item2 in item1.children"
                            @click="handleActive('/'+item2.path)"
                            :key="item2.id">
                <template slot="title">
                  <i class="iconfont iconliebiao"></i>
                  <span>{{item2.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 内容主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 菜单栏text数据
      menuList: [],
      // 一级导航栏图标
      iconObj: {
        125: 'iconfont iconuser',
        103: 'iconfont iconquanxian',
        101: 'iconfont iconshangpin',
        102: 'iconfont iconicon',
        145: 'iconfont iconshujutongji'
      },
      // 是否折叠
      isCollapse: false,
      // 当前激活的导航栏
      activePath: ''
    }
  },

  created () {
    this.getMenus()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    // 请求菜单数据
    async getMenus () {
      const { data } = await this.$http.get('menus')
      this.menuList = data.data
    },

    // 处理登出
    loginOut () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
      this.$message({
        type: 'success',
        message: '退出登录成功！'
      })
    },

    // 处理导航栏的折叠
    handleToggle () {
      this.isCollapse = !this.isCollapse
    },

    // 处理激活
    handleActive (path) {
      this.activePath = path
      // 存储到本地
      window.sessionStorage.setItem('activePath', path)
    }
  }
}
</script>

<style scoped lang='stylus'>
.iconfont
  margin-right 10px
.header-wrapper
  background #373f41
  display flex
  justify-content space-between
  align-items center
  color #fff
  .icon-wrapper
    height 60%
    img
      height 100%
      vertical-align middle
      display inline-block
      margin-right 15px
    .icon-text
      font-size 20px
      font-weight bold
      vertical-align middle
.el-container
  height 100vh
  .asider-wrapper
    background #333744
  .toggle-botton
    color #fff
    text-align center
    cursor pointer
    margin-top 15px
  .el-menu
    border none
  .iconfont
    margin-right 10px
    font-size 14px
</style>
