import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login'
// import Home from '@/components/Home'
// import Welcome from '@/components/Welcome'
// import User from '@/components/user/User'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/Roles'
// import Cate from '@/components/goods/Cate'
// import Params from '@/components/goods/Params'
// import List from '@/components/goods/List'
// import Add from '@/components/goods/Add'
// import Order from '@/components/order/Order'
// import Report from '@/components/report/Report'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')
const User = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/user/User')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Roles')
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Params')
const List = () => import(/* webpackChunkName: "GoodsList_Add" */ '@/components/goods/List')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '@/components/goods/Add')
const Order = () => import(/* webpackChunkName: "Order_Report" */ '@/components/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '@/components/report/Report')

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
      { path: '/goods/add', name: 'Add', component: Add },
      { path: '/orders', name: 'Order', component: Order },
      { path: '/reports', name: 'Report', component: Report }
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
