<template>
  <div class="params">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false">
      </el-alert>

      <!-- 级联选择器 -->
      <el-form label-width="100px">
        <el-form-item label="选择商品分类">
          <el-cascader expand-trigger="hover" clearable v-model="selectedKeys" :options="cateList"
            :props="cascaderProps" @change="handleCascaderChange">
          </el-cascader>
        </el-form-item>
      </el-form>

      <!-- 选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="addParams">添加参数</el-button>
          <!-- 添加参数表格 -->
          <el-table :data="manyList" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 标签列表 -->
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" prop="opration">
              <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">编辑
                </el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" size="mini">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="addAttrs">添加属性</el-button>
          <!-- 添加静态属性 -->
          <el-table :data="onlyList" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 标签列表 -->
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">
                  {{item}}
                </el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" prop="opration">
              <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini">编辑
                </el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" size="mini">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>

    <!-- 添加动态参数弹框 -->
    <el-dialog title="添加动态参数" :visible.sync="manyDialogVisible" width="30%" @close="closeManyDialog">
      <el-form :model="manyForm" ref="manyFormRef" label-width="100px" :rules="manyFormRules">
        <!-- 用户名 -->
        <el-form-item label="动态参数名" prop="attr_name">
          <el-input v-model="manyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 取消/确定 -->
      <span slot="footer">
        <el-button @click="manyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitManyAdd">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加静态属性弹框 -->
    <el-dialog title="添加静态属性" :visible.sync="onlyDialogVisible" width="30%" @close="closeOnlyDialog">
      <el-form :model="onlyForm" ref="onlyFormRef" label-width="100px" :rules="onlyFormRules">
        <!-- 用户名 -->
        <el-form-item label="静态属性名" prop="attr_name">
          <el-input v-model="onlyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 取消/确定 -->
      <span slot="footer">
        <el-button @click="onlyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitOnlyAdd">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数/属性 -->
    <!-- 添加静态属性弹框 -->
    <el-dialog :title="'编辑'+editText" :visible.sync="dialogVisible" width="30%" @close="closeDialog">
      <el-form :model="editForm" ref="editFormRef" label-width="100px" :rules="editFormRules">
        <!-- 用户名 -->
        <el-form-item :label="editText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 取消/确定 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitEdit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 选中的id数组列表
      selectedKeys: [],
      // 级联选择器配置
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 分类列表（包含三层）
      cateList: [],
      // 当前选中的选项卡
      activeName: 'many',
      // 动态参数列表
      manyList: [],
      // 动态参数弹框显示与隐藏
      manyDialogVisible: false,
      // 添加动态参数input
      manyForm: {
        attr_name: ''
      },
      // 添加动态参数校验
      manyFormRules: {
        attr_name: [{ required: true, message: '动态参数名不能为空！', trigger: 'blur' }]
      },
      // 静态参数列表
      onlyList: [],
      // 静态属性弹框显示与隐藏
      onlyDialogVisible: false,
      // 添加静态属性input
      onlyForm: {
        attr_name: ''
      },
      // 添加静态属性校验
      onlyFormRules: {
        attr_name: [{ required: true, message: '静态属性名不能为空！', trigger: 'blur' }]
      },
      // 编辑参数/属性弹框的显示与隐藏
      dialogVisible: false,
      // 修改静态属性/动态参数input
      editForm: {
        attr_name: '',
        cat_id: '',
        attr_id: ''
      },
      // 修改静态属性/动态参数校验
      editFormRules: {
        attr_name: [{ required: true, message: '此项不能为空！', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 1.获取商品分类
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error('获取分类列表失败！')
      this.cateList = res.data
    },
    // 2.获取属性列表
    async getParamsList () {
      // 发起请求
      // 长度不为3
      if (this.selectedKeys.lenght < 3) {
        this.selectedKeys = []
        this.manyList = []
        this.onlyList = []
      }
      // 长度为3
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) this.$message.error('获取参数列表失败!')
      // 处理AttrVals, 将字符串转化为数组
      res.data.forEach(v => {
        v.attr_vals = v.attr_vals ? v.attr_vals.split(' ') : []
        v.inputVisible = false
        v.inputValue = ''
      })
      // 赋值
      this.activeName === 'many' ? this.manyList = res.data : this.onlyList = res.data
      console.log(res.data)
    },
    // 3.级联选择器发生改变时触发
    handleCascaderChange () {
      this.getParamsList()
    },
    // 4.切换选项卡时触发
    handleTabClick () {
      // 当分类没有选择时不触发请求
      if (this.selectedKeys.length < 3) return false
      this.getParamsList()
    },
    // 5.添加参数
    addParams () {
      this.manyDialogVisible = true
    },
    // 6.监听添加动态参数关闭
    closeManyDialog () {
      this.manyForm.attr_name = ''
    },
    // 7.提交添加并发起请求
    async submmitManyAdd () {
      this.$refs.manyFormRef.validate(async value => {
        if (!value) return this.$message.warning('动态属性名不能为空！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.manyForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加动态属性失败！')
        // 关闭弹框
        this.manyDialogVisible = false
        // 更新页面
        this.getParamsList()
        // 提示用户添加成功
        this.$message.success('添加动态属性成功！')
      })
    },
    // 8.添加属性
    addAttrs () {
      this.onlyDialogVisible = true
    },
    // 9.点击删除tag
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.setAttrVals(row)
    },
    // 10.点击显示input输入框
    showInput (row) {
      console.log(row)
      row.inputVisible = true
      // this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 11.按下回车/失去焦点编辑成功
    handleInputConfirm (row) {
      if (!row.inputValue) {
        row.inputVisible = false
        return false
      }
      const inputValue = row.inputValue
      if (inputValue) {
        row.attr_vals.push(inputValue)
      }
      this.setAttrVals(row)
      row.inputVisible = false
      row.inputValue = ''
    },
    // 12.将对attr_vals的操作保存到数据库中
    async setAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('更新属性失败！')
      this.$message.success('更新属性成功！')
    },
    // 13.监听添加静态参数弹框关闭
    closeOnlyDialog () {
      this.onlyForm.attr_name = ''
    },
    // 14.提交添加并发起请求
    async submmitOnlyAdd () {
      this.$refs.onlyFormRef.validate(async value => {
        if (!value) return this.$message.warning('静态属性名不能为空！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.onlyForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加静态属性失败！')
        // 关闭弹框
        this.onlyDialogVisible = false
        // 更新页面
        this.getParamsList()
        // 提示用户添加成功
        this.$message.success('添加静态属性成功！')
      })
    },
    // 15. 编辑分类名
    async handleEdit (row) {
      this.dialogVisible = true
      const { data: res } = await this.$http.get(`categories/${row.cat_id}/attributes/${row.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('获取分类名失败！')
      this.editForm.attr_name = res.data.attr_name
      this.editForm.cat_id = res.data.cat_id
      this.editForm.attr_id = res.data.attr_id
    },
    // 16. 删除分类名
    handleDelete (row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${row.cat_id}/attributes/${row.attr_id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败！')
          this.getParamsList()
          this.$message.success('删除成功！')
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    // 17. 监听修改静态属性/动态参数弹框的关闭
    closeDialog () {
      this.editForm.attr_name = ''
    },
    // 18. 提交编辑并发起请求
    async submmitEdit () {
      this.$refs.editFormRef.validate(async value => {
        if (!value) return this.$message.warning(this.editText + '不能为空！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('编辑' + this.editText + '失败！')
        // 关闭弹框
        this.dialogVisible = false
        // 更新页面
        this.getParamsList()
        // 提示用户添加成功
        this.$message.success('编辑' + this.editText + '成功！')
      })
    }
  },
  computed: {
    // 是否为disabled状态
    isDisabled () {
      return !this.selectedKeys.length > 0
    },
    // 分类 ID
    cateId () {
      if (this.selectedKeys.length < 3) return null
      return this.selectedKeys[2]
    },
    // 修改动态参数/属性
    editText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>

<style scoped lang='stylus'>
.el-card
  margin-top 20px
.el-form
  margin 20px 0
  width 40%
  .el-cascader
    width 100%
.el-table
  margin 20px 0 10px 0
  .el-input
    width 100px
  .el-tag
    margin-right 20px
.el-dialog
  .el-form
    width 100%
    .el-input
      width 100%
</style>
