<template>
  <div class="roles">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="primary" class="add-btn" @click="addRole">添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="rolesList" style="width: 100%" stripe border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
            :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop':'']">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二/三级权限 -->
            <el-col :span="19">
              <!-- 二级权限 -->
              <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '':'bdtop', 'vcenter']">
                <el-col :span="6">
                  <el-tag closable type="success" @close="removeRightById(scope.row, item2.id)">{{item2.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <!-- 三级权限 -->
                  <el-tag @close="removeRightById(scope.row, item3.id)" type="warning" closable
                    v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" prop="desc" width="300px">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)" size="mini">编辑</el-button>
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)" size="mini">删除</el-button>
          <!-- 设置 -->
          <el-button type="warning" icon="el-icon-setting" @click="handleSetting(scope.row)" size="mini">分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色弹框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addForm" ref="addFormRef" label-width="100px" class="demo-dynamic" :rules="addFormRules">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 取消/确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitAdd">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" ref="editFormRef" label-width="100px" class="demo-dynamic" :rules="editFormRules">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 取消/确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitEdit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="distributeDialogVisible" width="50%">
      <el-tree :data="rightsList" show-checkbox node-key="id" :default-checked-keys="rightsCheckedList"
        :props="defaultProps" default-expand-all ref="treeRef">
      </el-tree>
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
  name: 'Roles',
  data () {
    return {
      // 角色列表数据
      rolesList: [],
      // 添加角色数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色弹框显示/隐藏
      addDialogVisible: false,
      // 添加角色验证规则
      addFormRules: {
        roleName: { required: true, message: '请输入角色名', trigger: 'blur' },
        roleDesc: { required: true, message: '请输入角色描述', trigger: 'blur' }
      },
      // 添加角色数据
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色弹框显示/隐藏
      editDialogVisible: false,
      // 添加角色验证规则
      editFormRules: {
        roleName: { required: true, message: '请输入角色名', trigger: 'blur' },
        roleDesc: { required: true, message: '请输入角色描述', trigger: 'blur' }
      },
      // 角色ID
      roleId: '',
      // 分配角色弹框显示/隐藏
      distributeDialogVisible: false,
      // 权限列表
      rightsList: [],
      // 权限列表树的设置
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 选择权限的数组
      rightsCheckedList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },
    // 弹出编辑角色并根据ID查询角色信息
    async handleEdit (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败！')
      this.editForm = res.data
      this.roleId = id
    },
    // 删除角色
    handleDelete (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
          this.getRolesList()
          this.$message.success('删除角色成功！')
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    // 显示分配权限弹框
    async handleSetting (role) {
      // 清空上一次的数组
      this.rightsCheckedList = []
      // 显示弹框
      this.distributeDialogVisible = true
      // 发起请求
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightsList = res.data
      this.getRightsCheckedList(role, this.rightsCheckedList)
      // 获取/设置当前roleId
      this.roleId = role.id
    },
    // 递归求选中的id
    getRightsCheckedList (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getRightsCheckedList(item, arr))
    },
    // 提交并发起分配角色请求
    async submmitDistribute () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const rids = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids })
      if (res.meta.status !== 200) return this.$message.error('授权失败！')
      this.$message.success('授权成功！')
      // 更新数据
      this.getRolesList()
      this.distributeDialogVisible = false
    },
    // 通过id删除角色权限
    async removeRightById (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
          role.children = res.data
          this.$message.success('删除权限成功！')
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    // 添加角色弹框
    addRole () {
      this.addDialogVisible = true
    },
    // 提交添加角色请求
    submmitAdd () {
      this.$refs.addFormRef.validate(async value => {
        if (!value) return this.$message.warning('角色名/角色描述不能为空！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')

        // 关闭弹框
        this.addDialogVisible = false
        // 更新页面
        this.getRolesList()
        // 将addForm置空
        this.addForm = ''
        // 提示用户修改信息成功
        this.$message.success('添加角色成功！')
      })
    },
    // 编辑角色弹框
    editRole () {
      this.editDialogVisible = true
    },
    // 提交添加角色请求
    submmitEdit () {
      this.$refs.editFormRef.validate(async value => {
        if (!value) return this.$message.warning('角色名/角色描述不能为空！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.put(`roles/${this.roleId}`, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败！')
        // 关闭弹框
        this.editDialogVisible = false
        // 更新页面
        this.getRolesList()
        // 提示用户修改信息成功
        this.$message.success('编辑角色成功！')
      })
    }
  }
}
</script>

<style scoped lang='stylus'>
.roles
  .add-btn
    margin 20px 0
  .el-tag
    margin 7px
  .bdtop
    border-top 1px solid #eee
  .bdbottom
    border-bottom 1px solid #eee
  .vcenter
    display flex
    align-items center
</style>
