import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/user/User'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/home',
    name: 'Home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/users', name: 'User', component: User }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 登录权限/全局路由守卫
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if ((to.fullPath !== '/login') && !token) return next('/login')
  next()
})
export default router
