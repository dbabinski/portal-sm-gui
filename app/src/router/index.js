import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

import LayoutAdmin from '@/layouts/admin'
import LayoutUser from '@/layouts/user'

export const constantRoutes = [
  {
    path: '/',
    component: LayoutUser,
    redirect: 'dashboard-user',
    children: [
      {  
        path: '/dashboard-user',
        component: () => import('@/views/dashboard/user'),
        name: 'dashboard-user',
        meta: { title: 'Panel Klienta', affix: true }
      }  
    ]  
  },

  {
    path: '/admin',
    component: LayoutAdmin,
    redirect: 'dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: 'Panel', affix: true }
      }
    ]
    // component: () => import('@/layouts/admin/index'),
    // meta: { title: 'Panel Administratora', affix: true }  
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router