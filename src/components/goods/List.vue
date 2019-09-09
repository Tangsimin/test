<template>
  <div>
    <h3>商品列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/welcome">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" v-model="queryData.query" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" @click="goPage">添加商品</el-button>
      <el-table :data="goodsList" border stript>
        <!-- 通过el-table-column来设置表格中的每一列数据
        label:用来设置列标题
        prop:用来设置需要展示的数据的名称-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width=70px></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width=80px></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width=140px>
          <template slot-scope="scope">
            {{scope.row.add_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyGoods(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页模块 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryData.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加商品 -->
    <!-- <el-dialog title="新增商品" :visible.sync="addGoodsDialogVisible" width="50%" @close="addgoodsDialogClosed">
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px">
        <el-form-item label="商品名称:" prop="goods_name">
          <el-input v-model="addGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格:" prop="goods_price">
          <el-input v-model="addGoodsForm.goods_price" ></el-input>
        </el-form-item>
        <el-form-item label="商品重量:" prop="goods_weight">
          <el-input v-model="addGoodsForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="创建时间:" prop="add_time">
          <el-input v-model="addGoodsForm.add_time"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goPage">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //    商品列表
      goodsList: [],
      total:0,
      addGoodsDialogVisible:false,
      addGoodsForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        add_time:''
      },
      addGoodsFormRules:{
         goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '用户名在3~50个字符之间',
            trigger: 'blur'
          }
        ],
        goods_price: [
          { required:true, message: '请输入商品价格', trigger: 'blur' }
        ],
          goods_weight: [
          { required:true, message: '请输入商品重量', trigger: 'blur' }
        ],
         add_time: [
          { required:true, message: '请输入商品添加时间', trigger: 'blur' }
        ]
      },
      addGoodsFormRef:{

      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 添加商品弹框
    showGoodsList() {
      this.addGoodsDialogVisible=true
    },
    // 获取商品表格数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryData
      })
      if(res.meta.status!==200) return this.$message.error('获取商品列表失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 关闭弹窗重置表单里的数据
    addgoodsDialogClosed(){
      this.$refs.addGoodsFormRef.resetFields()
    },
    // 添加商品
    goPage(){
      this.$router.push('/goods/add')
      
    },
    // 编辑商品信息
    modifyGoods() {},

    // 删除商品
     async deleteGoods(id) {
      this.$confirm('是否确认删除该项商品')
      .then(async result=>{
        console.log('点击了确定')
        console.log('需要删除的商品的id:'+id)
        const{data:res}=await this.$http.delete(`goods/${id}`)
        this.getGoodsList()
        console.log(res)
      })
      .catch(res=>{
        console.log('点击了取消')
      })
    },
    // 自动获取分页面的动态数据
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryData.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryData.pagenum = newpage
      this.getGoodsList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
  margin-right: 20px;
}
</style>