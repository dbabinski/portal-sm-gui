import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

import LayoutAdmin from '@/layouts/admin'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/user/index'),
    meta: { title: 'Panel Klienta', affix: true }  
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
  routes: routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router