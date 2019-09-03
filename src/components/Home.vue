<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'65px':'200px'">
        <div class="toggle-button" @click="toggleCollpase">| | |</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in  menulist" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 字体图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级子菜单，没有儿子 -->
            <el-menu-item
              :index="'/'+subItem.path+''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savaNavState('/'+subItem.path+'')"
            >
              <template slot="title">
                <!-- 字体图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 放置路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    // 在生命周期created这个阶段发送请求获取菜单信息
    this.getMenu()
    // 当页面加载的时候,将读取sessionStorage中保存的activePath
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenu() {
      // 发送请求获取菜单信息
      const { data: res } = await this.$http.get('menus')
      // if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      // this.$message.success()
      // console.log(res)
      this.menulist = res.data
      // console.log(this.menulist)
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollpase() {
      // 当用户点|||切换收缩
      this.isCollapse = !this.isCollapse
    },
    savaNavState(path) {
      // 将path保存到sessionStorage
      sessionStorage.setItem('activePath', path)
      // 将现在的激活项更改为path
      this.activePath = path
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
}
</style>