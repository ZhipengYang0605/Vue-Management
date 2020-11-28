<template>
  <div class="cate">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品 -->
    <el-button class="add-btn" type="primary" @click="openDialog">添加分类</el-button>
    <!-- 表格部分 -->
    <zk-table index-text="#" :data="goodsList" :columns="columns" border show-index tree-type :selection-type="false"
      :show-row-hover="false" :expand-type="false">
      <!-- 是否有效 -->
      <template slot="isValid" slot-scope="scope">
        <i class="el-icon-success" style="color: #67C23A;" v-if="!scope.row.cat_deleted"></i>
        <i class="el-icon-error" style="color: #F56C6C;" v-else></i>
      </template>
      <!-- 排序 -->
      <template slot="sort" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot-scope="scope" slot="operation">
        <!-- 修改 -->
        <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.cat_id)" size="mini">编辑</el-button>
        <!-- 删除 -->
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.cat_id)" size="mini">删除
        </el-button>
      </template>
    </zk-table>

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%" @close="closeAddDialog">
      <el-form :model="addForm" ref="addFormRef" label-width="100px" class="demo-dynamic" :rules="addFormRules">
        <!-- 用户名 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="父级分类">
          <el-cascader expand-trigger="hover" clearable v-model="selectedKeys" :options="parentCateList"
            :props="cascaderProps" @change="handleCascaderChange" :change-on-select="true">
          </el-cascader>
        </el-form-item>
      </el-form>

      <!-- 取消/确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitAdd">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类 -->
    <el-dialog title="添加分类" :visible.sync="editDialogVisible" width="40%" @close="closeEditDialog">
      <el-form :model="editForm" ref="editFormRef" label-width="100px" :rules="editFormRules">
        <!-- 用户名 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 取消/确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitEdit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[2, 5, 10, 15]" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 配置项
      columns: [
        // 第一列
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // 第二列
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isValid'
        },
        // 第三列
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort'
        },
        // 第四列
        {
          label: '操作',
          type: 'template',
          prop: 'cat_id',
          template: 'operation'
        }
      ],
      // 当前页
      currentPage: 1,
      // 商品列表总数
      total: 0,
      // 添加商品显示与隐藏
      addDialogVisible: false,
      // 添加分类验证规则
      addFormRules: {
        cat_name: [{ required: true, message: '请输入分类名', trigger: 'blur' }]
      },
      addForm: {
        // 分类名
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 修改分类名弹框显示/隐藏
      editDialogVisible: false,
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      // 添加分类验证规则
      editFormRules: {
        cat_name: [{ required: true, message: '请输入分类名', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCatesList()
  },
  methods: {
    // 获取分类列表
    async getCatesList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    // 改变每页显示列表数
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCatesList()
    },
    // 改变当前页面
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCatesList()
    },
    // 打开添加分类框
    openDialog () {
      this.addDialogVisible = true
      this.getParentCateList()
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类列表失败！')
      this.parentCateList = res.data
    },
    // 级联选择器改变时触发
    handleCascaderChange () {
      const selectedKeysLen = this.selectedKeys.length
      if (selectedKeysLen > 0) {
        this.addForm.cat_pid = this.selectedKeys[selectedKeysLen - 1]
        this.addForm.cat_level = selectedKeysLen
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    // 提交添加分类时触发
    async submmitAdd () {
      this.$refs.addFormRef.validate(async value => {
        if (!value) return this.$message.warning('分类名不能为空！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        // 关闭弹框
        this.addDialogVisible = false
        // 更新页面
        this.getCatesList()
        // 提示用户添加成功
        this.$message.success('添加分类成功！')
      })
    },
    // 监听关闭添加分类弹框
    closeAddDialog () {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addFormRef.resetFields()
      this.selectedKeys = []
      this.addForm.cat_level = 0
      this.addForm.cat_pid = 0
    },
    // 编辑
    async handleEdit (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取分类名失败！')
      this.editForm.cat_name = res.data.cat_name
      this.editForm.cat_id = res.data.cat_id
    },
    // 删除
    handleDelete (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('categories/' + id)
          if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
          this.getCatesList()
          this.$message.success('删除分类成功！')
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    },
    // 监听关闭编辑分类名
    closeEditDialog () {

    },
    // 提交修改分类时触发
    async submmitEdit () {
      this.$refs.editFormRef.validate(async value => {
        if (!value) return this.$message.warning('分类名不能为空！')
        // 发起用户修改信息请求
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}`, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('编辑分类名失败！')
        // 提示用户添加成功
        this.$message.success('添加分类成功！')
        // 关闭弹框
        this.editDialogVisible = false
        // 更新页面
        this.getCatesList()
      })
    }
  }
}
</script>

<style scoped lang='stylus'>
.add-btn
  margin 20px 0
.el-pagination
  margin 20px 0
.el-cascader
  width 100%
</style>
