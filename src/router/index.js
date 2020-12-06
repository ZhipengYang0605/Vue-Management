import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/user/User'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import List from '@/components/goods/List'
import Add from '@/components/goods/Add'

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
      { path: '/users', name: 'User', component: User },
      { path: '/rights', name: 'Rights', component: Rights },
      { path: '/roles', name: 'Roles', component: Roles },
      { path: '/categories', name: 'Cate', component: Cate },
      { path: '/params', name: 'Params', component: Params },
      { path: '/goods', name: 'List', component: List },
      { path: '/goods/add', name: 'Add', component: Add }
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
