<template>
  <div>
    <h3>角色列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/welcome">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              :class="['bdbottom',index1==0?'bdtop':'']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2==0?'':'bdtop']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="9">
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="15">
                    <el-tag
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      @close="removeRightById(scope.row.id,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="200px">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRoles(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRolesDialogVisible(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限对话框 -->
      <!-- node-key用来设置树形控件节点的值是哪个属性 -->
      <!-- show-checkbox添加复选框 -->
      <!-- default-expand-all展开所有节点 -->
      <!-- default-checked-keys默认选择节点ID -->
      <el-dialog
        title="分配权限角色"
        :visible.sync="setRolesDialogVisible"
        width="50%"
        @close="setRolesDialogClose"
      >
        <el-tree
          :data="rightsList"
          :props="treeProps"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="defkeys"
          ref="myTree"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allot">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 添加角色信息 -->
    <el-dialog
      title="新增角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色操作:" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editRolesForm"
        :rules="editRolesFormRules"
        ref="editRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色ID:" prop="roleId">
          <el-input v-model="editRolesForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterEditRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rightsList: [],
      addRolesDialogVisible: false,
      editRolesDialogVisible: false,
      // 是否显示权限的弹窗
      setRolesDialogVisible: false,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //  添加用户表单
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //  修改用户表单
      editRolesForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: false, message: '请输入角色操作内容', trigger: 'blur' }
        ]
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: false, message: '请输入角色操作内容', trigger: 'blur' }
        ]
      },
      addRolesFormRef: {},
      editRolesFormRef: {},
      //  将三级权限Id添加defkeys数组中
      defkeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      //   this.$message.success('获取角色成功')
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 添加角色的弹出框
    showAddRoles() {
      this.addRolesDialogVisible = true
    },
    // 编辑角色的弹出框
    editRoles() {
      this.editRolesDialogVisible = true
    },
    addDialogClosed() {
      // 添加绝色对话框关闭之后,重置表达
      this.$refs.addRolesFormRef.resetFields()
    },
    // 修改角色对话框关闭之后,重置表达
    editDialogClosed() {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 添加用户
    addRoles() {
      // 进行表单预验证
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return this.$message.error('角色验证失败')
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) return this.$message.error('角色添加失败')
        this.$message.success('角色添加成功')
        // 关闭对话框
        this.addRolesDialogVisible = false
        this.getRolesList()
      })
    },
    // 删除角色
    async deleteRoles(id) {
      this.$confirm('是否删除该角色')
        .then(async result => {
          console.log('点击了确定')
          console.log('需要删除角色的ID是:' + id)
          // 直接发送请求
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200)
            return this.$message.error('删除角色失败')
          this.$message.success('删除角色成功')
          this.getRolesList()
        })
        .catch(res => {
          console.log('点击了取消')
        })
    },
    // 先获取要编辑角色的信息
    async editRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200)
        return this.$message.error('获取角色信息失败')
      this.$message.success('获取角色信息成功')
      // 将获取的数据保存在editRolesForm
      this.editRolesForm = res.data
      // 打开弹出框
      this.editRolesDialogVisible = true
    },
    // 编辑角色信息
    enterEditRoles() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证信息失败')
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          this.editRolesForm
        )
        console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('编辑角色信息失败')
        this.$message.success('修改用户信息成功')
        this.editRolesDialogVisible = false
        this.getRolesList()
      })
    },
    async removeRightById(roleId, rightId) {
      console.log(roleId)
      console.log(rightId)
      const result = await this.$confirm('请问确定删除该选项吗').catch(err => {
        return err
      })
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete(
          `roles/${roleId}/rights/${rightId}`
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('取消权限失败')
        }
        this.$message.success('取消权限成功')
        // 重新加载权限
        this.getRolesList()
      }
    },
    async showRolesDialogVisible(role) {
      this.roleId = role.id
      // 发送请求
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defkeys)
      this.setRolesDialogVisible = true
    },
    getLeafKeys(node, arr) {
      // console.log(roleInfo);
      if (!node.children) {
        //没有children属性，那么就是一个三级节点，那么就将节点的id添加到defKeys数组中
        return arr.push(node.id)
      }

      //如果是一级或者二级的权限，应该遍历一级或者二级权限下属的children属性来判断是不是三级权限
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听权限对话框的关闭事件
    setRolesDialogClose() {
      this.defkeys = []
    },
    async allot() {
      // getCheckedKeys返回目前被选中的节点的key所组成的数组
      var temp1 = this.$refs.myTree.getCheckedKeys()
      // getHalfCheckedkeys返回半选中的节点的key所组成的数组
      var temp2 = this.$refs.myTree.getHalfCheckedKeys()
      const idArr = [...temp1, ...temp2]
      const idStr = idArr.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRolesDialogVisible = false
    }
  }
}
</script>

<style lang='less' scope>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
