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
                <el-button type="primary">添加分类</el-button>
            </el-col>
        </el-row>
        <!-- :data 设置组件的数据来源 -->
        <!-- :columns 用来设置表格每一列的信息 -->
        <!-- index-text='#' 用来设置索引 -->
        <!-- show-row-hover 鼠标悬停高亮 -->
        <!-- expand-type 设置是否又展开列 -->
        <!-- selection-type 设置是否有复选按钮 -->
        <tree-table :data="cateList" :columns="columns"
        show-index index-text="#" border :show-row-hover="false"
        :expand-type="false" :selection-type="false">
        <template slot="test" slot-scope="scope">
            <i class=""></i>
        </template>
        </tree-table>
    </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            // 查询分类信息的参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 保存分类信息
            cateList:[],
            total:0,
            columns:[
                {label:'分类名称',
                prop:'cat_name'},
                {
                label:'是否有效',
                type:'template',
                template:'test'
                },
                {
                label:'排序',
                type:'template',
                template:'sort'
                },
                {
                 label:'操作',
                 type:'template',
                template:'opt'

                }
            ]
        }
    },
    created(){
       this.getCateList() 
    },
    methods:{
        async getCateList(){
            const{data:res}=await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status!==200) return this.$message.error("获取商品信息失败")
            this.$message.success("获取商品信息成功")
            console.log(res)
            this.cateList=res.data.result
            this.total=res.data.total
        }
    }
}
</script> 
<style lang="less" scoped>

</style>