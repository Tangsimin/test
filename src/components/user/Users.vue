<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/welcome">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" v-model="queryData.query" clearable @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
      <el-button type="primary" @click="showAddUser">添加用户</el-button>
      <!-- 表格 -->
      <!-- 添加边框和隔行变色 -->
      <el-table :data="userList" border stript>
        <!-- 通过el-table-column来设置表格中的每一列数据
      label:用来设置列标题
        prop:用来设置需要展示的数据的名称-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 使用作用域插槽scope接受table中遍历的每一行数据,可以通过scope.row这种形式来访问每一行的数据,
            什么时候应该使用作用域插槽呢?只要是有特殊的显示方式需要处理,都必须使用作用域插槽来实现,
          因为表格只能展示简单的数据-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyUser(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRole(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->

      <!-- 添加用户模块 -->
    </el-card>
    <el-dialog title="新增用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名称:" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码:" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息模块 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名称:" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterModifyUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户角色信息 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="setRolesDialogClosed"
    >
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>

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
  </div>
</template>
<script>
import { parse } from 'path'
import { log } from 'util'
export default {
  data() {
    //验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      queryData: {
        // 查询关键字
        query: '',
        // 查询页码
        pagenum: 1,
        // 每页有多少数据
        pagesize: 2
      },
      // 保存请求回来的用户列表数据
      userList: [],
      total: 0,
      // 是否显示添加用户弹窗
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的表单数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入登录邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入登录手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码格式不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      editFormRef: {},
      // 表单内容验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入登录邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入登录手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码格式不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      // 是否显示修改用户弹窗

      editDialogVisible: false,
      // 分配角色对话框
      setRolesDialogVisible: false,
      // 保存正在操作的角色信息
      userInfo: {},
      // 保存所有的角色信息
      rolesList: [],
      // 保存用户选中的角色id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryData
      })
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryData.pagesize = newsize
      this.getUserList()
    },
    handleCurrentChange(newpage) {
      this.queryData.pagenum = newpage
      this.getUserList()
    },
    // 监听状态事件
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_status = !userinfo.mg_status
        return this.$message.error('更新用户状态失败!')
      }
    },
    async deleteUser(id) {
      this.$confirm('请问是否删除该用户')
        .then(async result => {
          console.log('点击了确定')
          console.log('需要删除用户的ID是:' + id)
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message.success('删除用户成功')
          // 重新获取最新数据
          this.getUserList()
        })
        .catch(res => {
          console.log('点击了取消')
        })
    },
    showAddUser() {
      // 添加用户对话框弹出
      this.addDialogVisible = true
    },
    addDialogClosed() {
      // 添加用户对话框关闭之后,重置表达
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      // 关闭修改用户信息对话框重置内容
      this.$refs.editFormRef.resetFields()
    },
    // 关闭分配用户角色信息之后的内容重置
    setRolesDialogClosed() {},
    // 添加用户
    addUser() {
      // 调用validate进行表单验证
      this.$refs.addFormRef.validate(async valid => {
        if (valid === false)
          //  验证失败
          return this.$message.error('验证失败')
        //  验证成功,去做登录
        //  发请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // 判断如果添加失败,就做提示
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        //  关闭对话框
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 编辑用户的对话框
    async modifyUser(id) {
      //  发送请求根据id获取用户信息
      const { data: res } = await this.$http.get('users/' + id)
      // 如果添加失败,就做提示
      if (res.meta.status !== 200)
        return this.$message.error('获取用户信息失败')
      // 将获取到的数据保存到数据editForm
      this.editForm = res.data
      // 显示弹出窗
      this.editDialogVisible = true
    },
    // 修改用户信息
    enterModifyUser() {
      // 当用户点击修改确定信息按钮进行表单验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证失败')
        // 验证成功,开始发送请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改信息成功')
        this.editDialogVisible = false
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        // 用户信息修改成功
        this.$message.success('修改信息成功')
        // 刷新列表信
        this.getUserList()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    async showSetRole(userInfo) {
      // 保存起来以后供后续使用
      this.userInfo = userInfo
      // 获取所有的角色信息,以备下拉列表使用
      // 发送请求根据id完成删除操作
      const { data: res } = await this.$http.get('roles')
      // 判断如果删除失败,就做提示
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.setRolesDialogVisible = true
    },
    async setRole() {
      // 当用户点击确定按钮之后
      // 判断用户是否选择了需要分配的角色
      if (!this.selectedRoleId) {
        return this.$message.error('请选择需要分配的角色')
      }
      // 发送请求完成分配角色的操作
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoleId }
      )
      console.log(res)
      // 判断如果删除失败,就做提示
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      //  关闭对话框
      this.setRolesDialogVisible = false
    },
    setRolesDialogClosed() {
      // 当关闭对话框的时候,重置下拉框中的内容
      ;(this.selectedRoleId = ''), (this.userInfo = {})
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