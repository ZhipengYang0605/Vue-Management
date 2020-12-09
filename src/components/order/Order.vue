<template>
  <div class="order">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- input输入框和添加用户按钮 查询接口失效-->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input clearable @clear="clearInput" placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column width="100px" prop="order_price" label="订单价格"></el-table-column>
        <el-table-column width="100px" prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100px" prop="is_send" label="是否发货"></el-table-column>
        <el-table-column width="180px" prop="create_time" label="下单时间"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <!-- 修改地址 -->
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)" size="mini"></el-button>
            <!-- 查看物流 -->
            <el-button type="success" icon="el-icon-location-outline" @click="handleLogistics(scope.row)"
              size="mini">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[2, 5, 10, 15]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址弹框 -->
    <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="50%" @close="closeAddressDialog">
      <el-form :model="addressForm" ref="addressFormRef" label-width="100px" :rules="addressFormRules">
        <!-- 级联选择器 -->
        <el-form-item label="省市区/县" prop="city_address">
          <el-cascader :options="cityOptions" v-model="addressForm.city_address" :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>

        <!-- 详细地址 -->
        <el-form-item label="详细地址" prop="detail_address">
          <el-input v-model="addressForm.detail_address"></el-input>
        </el-form-item>
      </el-form>

      <!-- 取消/确定 -->
      <span slot="footer">
        <el-button @click="addressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submmitEdit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流弹框 -->
    <el-dialog title="物流进度" :visible.sync="expressDialogVisible" width="50%"></el-dialog>
  </div>
</template>

<script>
import { formateDate } from '@/components/tools/tools.js'
import cityOptions from './citydata'
export default {
  name: 'Order',
  data () {
    return {
      // 用户信息
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 商品列表
      orderList: [],
      // 总页码数
      total: 0,
      // 当前页码
      currentPage: 1,
      // 修改地址弹框
      addressDialogVisible: false,
      // 修改地址信息
      addressForm: {
        // 省市县地址
        city_address: '',
        // 详细地址
        detail_address: ''
      },
      // 检测规则
      addressFormRules: {
        city_address: [{ required: true, message: '地址不能为空！', trigger: 'blur' }],
        detail_address: [{ required: true, message: '详细地址不能为空！', trigger: 'blur' }]
      },
      // 城市数据对象
      cityOptions: cityOptions,
      // 物流弹框
      expressDialogVisible: false
    }
  },
  created () {
    this.getOderList()
  },
  methods: {
    // 获取订单列表
    async getOderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      res.data.goods.forEach(v => {
        v.create_time = formateDate(v.create_time * 1000)
      })
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 改变每页显示订单条数
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getOderList()
    },
    // 改变当前页码
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getOderList()
    },
    // 编辑订单
    handleEdit () {
      this.addressDialogVisible = true
    },
    // 查看物流
    async handleLogistics (row) {
      // 发起请求
      this.expressDialogVisible = true
    },
    // 清除输入框--->接口有问题
    clearInput () {

    },
    // 确认修改地址并且提交
    submmitEdit () {
      this.$refs.addressFormRef.validate(async value => {
        if (!value) return this.$message.warning('请将信息填写完整！')
        this.addressDialogVisible = false
      })
    },
    // 关闭修改地址弹框，并清除内容
    closeAddressDialog () {
      this.$refs.addressFormRef.resetFields()
    },
    // 选中城市后触发
    changeProvince () {

    }
  }
}
</script>

<style scoped lang='stylus'>
.el-card
  margin 20px 0
  .el-table
    margin 20px 0
.el-cascader
  width 100%
</style>
