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
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
