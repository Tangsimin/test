<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/welcome">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <!-- 搜索框 -->
    <el-card>
      <el-input placeholder="请输入内容" v-model="queryData.query" clearable @clear="getOrdersList" style='width:300px'>
        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
      </el-input>

      <!-- 主体内容 -->
      <el-table :data="ordersList" style="width: 100%" border stript>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="350px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status===0">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template slot-scope="scope">
            <template>{{scope.row.is_send}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="150px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress"></el-button>
              <el-button type="success" icon="el-icon-location" size="mini" @click='showProgress'></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址操作 -->
    <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="50%" @close="handleClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.address2" prop="address2" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查找物流信息 -->
    <el-dialog
  title="物流信息"
  :visible.sync="progressVisible"
  width="50%"
>
   <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>

  </div>
</template>
<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      ordersList: [],
      addressDialogVisible:false,
      addressForm:{
          address1:[],
          address2:""
      },
      addressFormRules:{
          address1:[
              {required: true, message: '请输入省市区县', trigger: 'blur' }
          ],
          address2:[
            {required: true, message: '请输入地址', trigger: 'blur' }
          ]
      },
      cityData,
      progressVisible:false,
      progressInfo:[]
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    //   获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryData
      })
      //   console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取订单列表失败')
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    //   每页显示多少条
    handleSizeChange(newSize) {
      this.queryData.pagesize = newSize
      this.getOrdersList()
    },
    //   当前的页码
    handleCurrentChange(newPage) {
      this.queryData.pagenum = newPage
      this.getOrdersList()
    },
    // 修改地址
    editAddress() {
        this.addressDialogVisible=true
    },
    handleClose(){
        this.$refs.addressFormRef.resetFields()
    },
    // 查看物流信息
    async showProgress(){
        const{data:res}=await this.$http.get('/kuaidi/1106975712662')
        if(res.meta.status!==200) return this.$message.error('获取物流信息失败')
        this.$message.success('获取物流信息成功')
        this.progressInfo=res.data
        console.log(this.progressInfo)
        this.progressVisible=true
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader{
    width:100%
}
</style>