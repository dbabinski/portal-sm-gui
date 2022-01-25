import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import LayoutAdmin from '@/layouts/admin'
import LayoutUser from '@/layouts/user'



 export const constantRoutes = [
  {
    path: '/redirect',
    component: LayoutAdmin,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: LayoutUser,
    redirect: 'dashboard-user',
    children: [
      {  
        path: '/dashboard-user',
        component: () => import('@/views/dashboard/user'),
        name: 'Panel Klienta',
        meta: { title: 'Panel Klienta', affix: true }
      },
      {  
        path: '/articles',
        component: () => import('@/views/articles/user/index'),
        name: 'Artykuły',
        meta: { title: 'Artykuły', affix: true }
      }  
    ]  
  },

  {
    path: '/admin',
    component: LayoutAdmin,
    redirect: '/admin/dashboard',
    children: [
      {
        path: '/admin/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Panel Administratora',
        meta: { title: 'Panel Administratora', affix: true }
      },
      {
        path: '/admin/documentation',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Dokumentacja', icon: 'documentation', affix: true }
      },
      {
        path: '/admin/users',
        component: () => import('@/views/users/index'),
        name: 'Users',
        meta: { title: 'Użytkownicy', icon: 'documentation', affix: true }
      },
      {
        path: '/admin/clients',
        component: () => import('@/views/clients/index'),
        name: 'Clients',
        meta: { title: 'Klienci', affix: true }
      },
      {
        path: '/admin/articles',
        component: () => import('@/views/articles/admin/index'),
        name: 'Articles',
        meta: { title: 'Wpisy', affix: true }
      }
    ]

  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

]


const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
  1
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
