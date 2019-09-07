<template>
  <div>
    <h3>商品分类组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/welcome">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- :data 设置组件的数据来源 -->
      <!-- :columns 用来设置表格每一列的信息 -->
      <!-- index-text='#' 用来设置索引 -->
      <!-- show-row-hover 鼠标悬停高亮 -->
      <!-- expand-type 设置是否又展开列 -->
      <!-- selection-type 设置是否有复选按钮 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="test" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加商品分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- expandTrigger='hover'(鼠标悬停触发级联) 
           v-model(设置级联菜单绑定数据) :options(指定级联菜单数据源)  :props(用来配置数据显示的规则) 
          clearable(提供“X”号完成删除文本功能) change-on-select(是否可以选中任意一级的菜单)-->
          <el-cascader
            :props="cascaderProps"
            v-model="selectedKeys"
            :options="parentCateList"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询分类信息的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 保存分类信息
      cateList: [],
      // 父级分类列表
      parentCateList: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          type: 'template',
          template: 'test'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateForm: {
        //   分类名称
        cat_name: '',
        //   添加分类的父级id,0则表示父级为0,添加一级分类
        cat_pid: 0,
        //   添加分类的等级,0则表示添加一级分类
        cat_level: 0
      },
      addCateDialogVisible: false,
      //   添加用户表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //   指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品信息失败')
      this.$message.success('获取商品信息成功')
      //   console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      //当pagesize发生改变时触发
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      //当pagenum发生改变时触发
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加商品分类弹窗弹出
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类信息
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      // console.log(res.data)
      this.parentCateList = res.data
    },
    
    //   选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 分类的级别是1,2,3级,对应的数字是0,1,2
      // 如果用户选择了父级分类
      if (this.selectedKeys.length > 0) {
        // 则将数组中的最后一项设置为父级分类
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // level也要跟着发生变化
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return 
        const{data:res}=await this.$http.post('categories',this.addCateForm        )
          console.log(res)
        if(res.meta.status!==201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible=false
      })
    },
    // 关闭弹出信息重置
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    
  }
}
</script> 
<style lang="less" scoped>
</style>