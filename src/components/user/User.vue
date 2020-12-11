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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="handleAddUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" border class="table" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeSwitchState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)" size="mini"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)" size="mini"></el-button>
            <!-- 设置 -->
            <el-button type="warning" icon="el-icon-setting" @click="handleSetting(scope.row)" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[2, 5, 10, 15]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 修改用户信息的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%">
      <span>
        <el-form :model="editForm" ref="editFormRef" label-width="100px" class="demo-dynamic" :rules="editFormRules">
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <!-- 手机 -->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 取消/确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitEdit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addForm" ref="addFormRef" label-width="100px" class="demo-dynamic" :rules="addFormRules">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 取消/确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitAdd">确定</el-button>
      </span>
    </el-dialog>

    <!-- 角色分配弹框 -->
    <el-dialog title="角色分配" :visible.sync="distributeDialogVisible" width="30%" @close="dialogClose">
      <span>
        <el-form ref="distributeFormRef" label-width="100px" class="demo-dynamic">
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择角色">
              <el-option :label="item.roleName" :value="item.id" v-for="item in rolesList" :key="item.id"></el-option>
            </el-select>
          </p>
        </el-form>
      </span>
      <!-- 取消/确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitDistribute">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return cb()
      cb(new Error('请输入合法邮箱！'))
    }
    // 验证手机号码
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
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
        pagesize: 10
      },
      // 显示/隐藏编辑用户信息对话框
      editDialogVisible: false,
      // 修改用户资料数据
      editForm: {
        mobile: '',
        email: '',
        username: ''
      },
      // 修改用户验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 添加用户资料数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 显示/隐藏添加用户对话框
      addDialogVisible: false,
      // 当前页码
      currentPage: 1,
      // 用户列表总数
      total: 0,
      // 分配角色
      distributeDialogVisible: false,
      // 下拉框当前选中的roleId
      selectedRoleId: '',
      // 角色列表
      rolesList: [],
      // 当前角色信息
      userInfo: {
        username: '',
        role_name: '',
        id: ''
      }
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
      this.total = res.data.total
      console.log(this.userList)
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
    async handleEdit (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      this.editForm = res.data
    },

    // 提交用户修改的信息
    submmitEdit () {
      this.$refs.editFormRef.validate(async value => {
        if (!value) return this.$message.warning('邮箱/手机号码不合法！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败！')

        // 关闭弹框
        this.editDialogVisible = false
        // 更新页面
        this.getUserList()
        // 提示用户修改信息成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 点击显示添加用户对话框
    handleAddUser () {
      this.addDialogVisible = true
    },
    // 添加用户并发送请求
    submmitAdd () {
      this.$refs.addFormRef.validate(async value => {
        if (!value) return this.$message.warning('用户名/邮箱/手机号码/密码不合法！')
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.getUserList()
        this.$message.success('添加用户成功！')
        this.addForm = {}
        this.addDialogVisible = false
      })
    },
    // 删除用户
    async handleDelete (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
          this.getUserList()
          this.$message.success('删除用户成功！')
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    // 改变每页显示的数目
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 点击跳转所选页码
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 分配角色并发起请求
    async submmitDistribute () {
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配角色成功！')
      this.distributeDialogVisible = false
      this.getUserList()
    },
    // 点击显示分配角色弹框
    async handleSetting (user) {
      // 显示弹框
      this.distributeDialogVisible = true
      // 获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      this.userInfo = user
    },
    // 分配角色弹框关闭时触发
    dialogClose () {
      this.selectedRoleId = ''
    }
  }
}
</script>

<style scoped lang='stylus'>
.box-card
  margin-top 20px
  .table
    margin-top 20px
  .pagination
    margin-top 30px
</style>
