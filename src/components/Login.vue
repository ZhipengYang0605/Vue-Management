<template>
  <div id="login">
    <div class="wrapper">
      <!-- 头像 -->
      <div class="avator-box">
        <img class="avator-img"
             src="./../assets/logo.png"
             alt="">
      </div>
      <!-- 表单 -->
      <div class="form-box">
        <el-form :model="loginForm"
                 label-width="80px"
                 :rules="rules"
                 ref="ruleForm"
                 class="demo-ruleForm">
          <el-form-item prop="username"
                        label="账号">
            <el-input v-model="loginForm.username">
              <i slot="prefix"
                 class="iconfont iconicon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password"
                        label="密码">
            <el-input v-model="loginForm.password"
                      type="password">
              <i slot="prefix"
                 class="iconfont iconIOTtubiao_huabanfuben"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <div class="btn-wrapper">
          <el-button type="primary"
                     @click="handleLogin">登录</el-button>
          <el-button type="info"
                     @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { requstLogin } from './../api/index'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在 6 到 16 个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置
    handleReset () {
      this.$refs.ruleForm.resetFields()
    },
    // 登录
    handleLogin () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return false
        const { data } = await this.$http.post('login', this.loginForm)
        if (data.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // 保存token
        sessionStorage.setItem('token', data.data.token)
        // 路由跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang='stylus'>
#login
  position relative
  height 100vh
  background #2b4b6b
  .wrapper
    height 360px
    width 450px
    background-color #fff
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    border-radius 5px
    position relative
    .avator-box
      margin 0 auto
      transform translateY(-50%)
      height 152px
      width 152px
      padding 10px
      border-radius 50%
      box-sizing border-box
      background #fff
      box-shadow 0 0 10px 2px #ddd
      .avator-img
        height 100%
        width 100%
        border-radius 50%
        background #eee
    .form-box
      margin-top -20px
      .demo-ruleForm
        padding-right 40px
    .btn-box
      width 100%
      display flex
      justify-content center
      .btn-wrapper
        display inline-block
</style>
