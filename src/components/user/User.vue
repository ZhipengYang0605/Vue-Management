<template>
  <div id="user">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- input输入框和添加用户按钮 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="searchContent"
                    class="input-with-select">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList"
                border
                class="table"
                style="width: 100%">
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="username"
                         label="姓名"></el-table-column>
        <el-table-column prop="email"
                         label="邮箱"></el-table-column>
        <el-table-column prop="mobile"
                         label="电话"></el-table-column>
        <el-table-column prop="role_name"
                         label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="changeSwitchState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.row)"
                       size="mini"></el-button>
            <!-- 删除 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.row)"
                       size="mini"></el-button>
            <!-- 设置 -->
            <el-button type="warning"
                       icon="el-icon-setting"
                       @click="handleSetting(scope.row)"
                       size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改用户信息的对话框 -->
    <el-dialog title="提示"
               :visible.sync="editDialogVisible"
               width="30%">
      <span>这是一段信息</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      // 搜索框的内容
      searchContent: '',
      // 用户列表数据
      userList: [],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页码
        pagenum: 1,
        // 每页显示用户的数量
        pagesize: 2
      },
      // 编辑用户信息对话框
      editDialogVisible: false
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
    },

    // 改变switch的状态
    async changeSwitchState (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更改状态失败！')
      }
      this.$message.success('更改状态成功！')
    },

    // 修改用户的资料
    handleEdit (userInfo) {
      console.log(userInfo)
      this.editDialogVisible = true
    }
  }
}
</script>

<style scoped lang='stylus'>
.box-card
  margin-top 20px
  .table
    margin-top 20px
</style>
