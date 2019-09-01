import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'
// 导入字体图标inconfont.css
import './assets/fonts/iconfont.css'

import axios from 'axios';

// 设置基准地址
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/';

// 将axios添加到vue原型中
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
