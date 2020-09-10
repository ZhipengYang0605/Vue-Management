import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
// 登录权限
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  console.log(to.fullPath)
  if ((to.fullPath !== '/login') && !token) return next('/login')
  next()
})
export default router
