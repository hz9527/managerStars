import Vue from 'vue'
import Router from 'vue-router'
var Index
var routes = []
if (ENV === 'dev') {
  Index = () => import('../devPages/index')
  routes.push({
    path: '/login',
    name: 'login',
    component: () => import('../devPages/login')
  })
} else {
  Index = resolve => require.ensure([], () => {
    resolve(require(['../prodPages/index']))
  }, 'list')
}

Vue.use(Router)

routes.unshift({
  path: '/',
  name: 'index',
  component: Index
})
routes.push({
  redirect: '*',
  path: '/'
})

export default new Router({routes})
