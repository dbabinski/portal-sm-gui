import router from './router'
// import store from './store'
import { getToken } from '@/lib/auth'
import getPageTitle from '@/lib/get-page-title'

const whiteList = ['/login', '/auth-redirect'] 

router.beforeEach(async(to, from, next) => {
// after each change route - change page title
// TODO - page load defult (app-test) title before loading: 
// TODO fix it
  document.title = getPageTitle(to.meta.title)

// TODO - fix get real use token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
        next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  // TODO progres bar
})
