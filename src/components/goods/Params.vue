<template>
  <div>
    <h3>分类参数组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/welcome">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 添加动态参数的面板 将标签页改为many -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            size="mini"
            type="primary"
            :disabled="isButtonDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <el-table :data="manyTableData">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable 
                @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数的面板 将标签页改为many -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            size="mini"
            type="primary"
            :disabled="isButtonDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <el-table :data="onlyTableData">
            <!-- 展开列 -->
            <el-table-column type="expand">
                 <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable 
                @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数或属性对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%">
      <!-- 添加表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      //    被激活的页签名称
      activeName: 'many',

      //    绑定级联选择器的内容
      selectedKeys: [],
      //    保存动态参数数据
      manyTableData: [],
      //    保存静态属性数据
      onlyTableData: [],
       //控制添加参数.属性对话框的显示或隐藏
      addDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      //添加表单验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]},
    }
   
    
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取信息失败')
      this.cateList = res.data
      //保存总数据条数
      this.total = res.data.total
    },
    handleChange() {
      //    只允许选择三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData=[]
        this.onlyTableData=[]
        return
      }
      this.getParams()
    },

    tabClick() {
      if (!this.cateId) {
        return this.$message.error('请选择三级分类')
      }
      this.getParams()
    },
    async getParams() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      //    console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      res.data.forEach( item => {
          item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[]

        //添加一个bool值控制文本框的显示或者隐藏
        item.inputVisible = false
        //添加一个inputValue保存文本框值
        item.inputValue = ''
      })
      console.log(res.data)
      // 判断当前请求的是动态参数还是静态属性
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else if (this.activeName === 'only') {
        this.onlyTableData = res.data
      }
    },
      addParams() {
      //当用户点击对话框中的确定时，校验表单
      this.$refs.addFormRef.validate(async valid => {
        //校验不通过，return
        if (!valid) return
        //校验通过，发送请求完成添加参数或者属性
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          { 
            attr_name: this.addForm.attr_name, 
            attr_sel: this.activeName,
          }
        )

        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加数据失败')
        }
        this.$message.success('添加数据成功')
        this.addDialogVisible = false
        this.getParams()
      })
    },
    showInput(row){
        row.inputVisible = true;
        // 让文本框自动获取焦点
        // $nextTick方法的作用.就是当页面上元素被重新渲染之后,才会指定回调函数中的代码
         this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
        
    },
    handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.savaAttrVals(row)
    },
    async savaAttrVals(row){
        // 需要发起请求,保存这次操作
        const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {attr_name: row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
        })
        if(res.meta.status!=200) return this.$message.error('更新数据失败')
        this.$message.success('更新数据成功')
    },
    async handleInputConfirm(row){
        if(row.inputValue.trim().length===0){
            row.inputValue=''
             row.inputVisible = false;
            return 
        }
        // 如果没有return,则证明输入内容需要做后续处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        row.inputVisible=false
      this.savaAttrVals(row)
    }
  },
  computed: {
    isButtonDisabled() {
      if (this.selectedKeys.length != 3) {
        return true
      } else {
        return false
      }
    },
    //   当前选择的三级分类的ID
    cateId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText(){
        if(this.activeName==='many'){
            return '动态属性'
        }
        return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.input-new-tag{
    width: 120px;
}
</style>