import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import '@/assets/css/globle.css'
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

Vue.config.productionTip = false
// 配置基本请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
