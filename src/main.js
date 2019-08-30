import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// // 导入element-ui
// import ElementUI from "element-ui";
// // 导入element-ui的样式
// import "element-ui/lib/theme-chalk/index.css";
// // 注册element-ui
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
