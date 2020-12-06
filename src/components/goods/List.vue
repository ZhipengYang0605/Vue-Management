<template>
  <div class="goods">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="card">
      <!-- input输入框和添加用户按钮 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable
            @clear="clearInput">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="handleAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="goodsList" border class="table" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" size="mini"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.goods_id)" size="mini">
            </el-button>
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
  </div>
</template>

<script>
import { formateDate } from '@/components/tools/tools.js'
export default {
  name: 'List',
  data () {
    return {
      // 商品列表
      goodsList: [],
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每条显示条数
        pagesize: 5
      },
      // 当前页码
      currentPage: 1,
      // 总页数
      total: 20
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 点击添加商品
    handleAddGoods () {
      this.$router.push('/goods/add')
    },
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      this.total = res.data.total
      res.data.goods.forEach(item => {
        item.add_time = formateDate(item.add_time * 1000)
      })
      this.goodsList = res.data.goods
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
    },
    // 改变每页显示商品数量
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getGoodsList()
    },
    // 改变当前页码
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getGoodsList()
    },
    // 点击清除input输入框时触发
    clearInput () {
      this.queryInfo.query = ''
      this.getGoodsList()
    },
    // 编辑商品
    handleEdit () {

    },
    // 删除商品
    async handleDelete (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败！')
          this.getGoodsList()
          this.$message.success('删除成功！')
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '取消删除！'
          })
        })
    }
  }
}
</script>

<style scoped lang='stylus'>
.card
  margin 20px 0
  .el-table
    margin 20px 0
</style>
