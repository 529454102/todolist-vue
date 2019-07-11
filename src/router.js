import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import { getToken } from '@/utils/auth'
import Message from '@/utils/message'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

Vue.use(Router)


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login')
    }, {
      path: '/register',
      name: 'register',
      component: () => import('./views/register')
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken('token')) {
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (to.path === '/login' || to.path === '/register') {
      next()
    } else {
      Message({ message: '请登陆', type: 'error' })
      next({ path: '/login' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
