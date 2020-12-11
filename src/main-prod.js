import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import '@/assets/css/globle.css'
import ZkTable from 'vue-table-with-tree-grid'
// 引入富文本
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'

Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(ZkTable)

Vue.config.productionTip = false
// 配置基本请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 显示进度条
  NProgress.start()
  return config
})

// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
