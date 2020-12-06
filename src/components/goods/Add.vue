<template>
  <div class="add">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="card">
      <!-- 注意条 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form ref="goodsFormRef" :model="goodsForm" label-width="80px" :rules="goodsRules" label-position="top">
        <el-tabs tab-position="left" style="height: 200px;" v-model="activeIndex" :before-leave="beforeLeave"
          @tab-click="tabClick">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              选择商品分类:
              <el-cascader expand-trigger="hover" clearable v-model="goodsForm.goods_cat" :options="parentCateList"
                :props="cascaderProps" @change="handleCascaderChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="attr" border v-for="(attr, i) in item.attr_vals" :key="i">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="attr" border v-for="(attr, i) in item.attr_vals" :key="i">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList"
              :headers="tokenObj" list-type="picture" :on-success="handleUploadSuccess" :on-error="handleUploadError">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 图片预览 -->
      <el-dialog title="图片预览" :visible.sync="dialogVisible" width="40%">
        <img style="width: 100%;" :src="previewImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Add',
  data () {
    return {
      // 步骤条/标签页激活的下标
      activeIndex: '0',
      // 商品表单信息
      goodsForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品分类(数组的形式)
        goods_cat: [],
        // 上传的图片临时路径数组
        pics: [],
        // 富文本内容
        goods_introduce: '',
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: []
      },
      // 表单验证规则
      goodsRules: {
        // 商品名称验证规则
        goods_name: [{ required: true, message: '请输入商品名称！', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格！', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量！', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量！', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类！', trigger: 'blur' }]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数列表
      manyList: [],
      // 静态属性列表
      onlyList: [],
      // 上传图片列表
      fileList: [],
      // 图片上传的服务器网址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 请求头对象、
      tokenObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览对话框
      dialogVisible: false,
      // 需要预览的图片地址
      previewImg: ''
    }
  },
  created () {
    this.getParentCateList()
  },
  methods: {
    // 获取分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类列表失败！')
      this.parentCateList = res.data
    },
    // 级联表选中后触发
    handleCascaderChange () {
      if (this.goodsForm.goods_cat.length < 3) {
        this.$message.warning('只允许选择第三级分类！')
        this.goodsForm.goods_cat = []
      }
    },
    // 点击tab进入下一个tab-pane
    beforeLeave (activeName, oldActiveName) {
      if (this.goodsForm.goods_cat.length < 3 && oldActiveName === '0') {
        this.$message.warning('请先选择商品分类！')
        return false
      }
    },
    // 点击tab时触发
    async tabClick () {
      // 点击了商品参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) this.$message.error('获取参数列表失败!')
        // 处理AttrVals, 将字符串转化为数组
        res.data.forEach(v => {
          v.attr_vals = v.attr_vals ? v.attr_vals.split(' ') : []
        })
        this.manyList = res.data
        // 点击了商品属性
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) this.$message.error('获取静态参数失败!')
        // 处理AttrVals, 将字符串转化为数组
        res.data.forEach(v => {
          v.attr_vals = v.attr_vals ? v.attr_vals.split(' ') : []
        })
        this.onlyList = res.data
      }
    },
    // 图片预览
    handlePreview (file) {
      this.dialogVisible = true
      this.previewImg = file.response.data.url
    },
    // 删除图片
    handleRemove (file) {
      const index = this.goodsForm.pics.findIndex(v => v.pic === file.response.data.tmp_path)
      this.goodsForm.pics.splice(index, 1)
    },
    // 图片上传成功
    handleUploadSuccess (response) {
      const uploadObj = { pic: response.data.tmp_path }
      this.goodsForm.pics.push(uploadObj)
    },
    // 图片上传失败
    handleUploadError () {
      this.$message.error('上传图片失败！')
    },
    // 添加商品
    async addGoods () {
      this.$refs.goodsFormRef.validate(async value => {
        if (!value) return this.$message.warning('请将必填项填写完整！')
        // 深拷贝goodsForm
        const newGoodsForm = _.cloneDeep(this.goodsForm)
        // 处理goods_cat, 用','连接
        newGoodsForm.goods_cat = newGoodsForm.goods_cat.join(',')
        // 处理动态参数
        this.manyList.forEach(v => {
          const attrObjItem = {
            attr_id: v.attr_id,
            attr_value: v.attr_vals.join(' ')
          }
          newGoodsForm.attrs.push(attrObjItem)
        })
        // 处理静态属性
        this.onlyList.forEach(v => {
          const attrObjItem = {
            attr_id: v.attr_id,
            attr_value: v.attr_vals.join(' ')
          }
          newGoodsForm.attrs.push(attrObjItem)
        })
        // 发起添加商品请求
        const { data: res } = await this.$http.post('goods', newGoodsForm)
        // 判断返回值判断请求是否成功
        if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
        // 提示用户添加商品成功
        this.$message.success('添加商品成功！')
        // 跳转到商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped lang='stylus'>
.card
  margin 20px 0
  height 85vh
  .el-steps
    margin 20px 0
  .el-tabs
    height 100% !important
    .el-input
      width 50vw
    .el-button
      margin-top 60px
.quill-editor
  height 50vh
</style>
