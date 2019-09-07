import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式
import './assets/css/global.css'
// 导入字体图标inconfont.css
import './assets/fonts/iconfont.css'

import axios from 'axios';

Vue.component('tree-table',TreeTable)
// 设置基准地址
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/';

// 设置请求拦截器
axios.interceptors.request.use(config=>{
  // 请求拦截器中的函数会在每次请求之前执行
  // console.log(config)
  config.headers.Authorization=sessionStorage.getItem('token')
  return config
})
// 将axios添加到vue原型中
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
