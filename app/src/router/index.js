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
    redirect: 'main-page',
    children: [
      {  
        path: '/',
        component: () => import('@/views/mainPage/index'),
        name: 'stronaGlowna',
        meta: { title: 'Strona Główna', affix: true }
      },
      {  
        path: '/dashboard-user',
        component: () => import('@/views/dashboard/user'),
        name: 'panelKlienta',
        meta: { title: 'Panel Klienta', affix: true }
      },
      {  
        path: '/articles',
        component: () => import('@/views/articles/user/index'),
        name: 'artykulyWidok',
        meta: { title: 'Artykuły', affix: true }
      },
      {  
        path: '/articles/*',
        component: () => import('@/views/articles/user/components/ArticleView'),
        name: 'artykuly',
        meta: { title: 'Artykułyy', affix: true }
      } 
    ]  
  },

  {
    path: '/admin',
    component: LayoutAdmin,
    redirect: '/admin/dashboard',
    name: 'admin',
    children: [
      {
        path: '/admin/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'panelAdministratora',
        meta: { title: 'Panel Administratora', affix: true }
      },
      {
        path: '/admin/documentation',
        component: () => import('@/views/documentation/index'),
        name: 'documentation',
        meta: { title: 'Dokumentacja', icon: 'documentation', affix: true }
      },
      {
        path: '/admin/users',
        component: () => import('@/views/users/index'),
        name: 'users',
        meta: { title: 'Użytkownicy', icon: 'documentation', affix: true }
      },
      {
        path: '/admin/clients',
        component: () => import('@/views/clients/index'),
        name: 'clients',
        meta: { title: 'Klienci', affix: true }
      },
      {
        path: '/admin/articles',
        component: () => import('@/views/articles/admin/index'),
        name: 'articles',
        meta: { title: 'Wpisy', affix: true }
      },
      
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
