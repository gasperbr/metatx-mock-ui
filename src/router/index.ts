import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import LimitOrder from '../views/LimitOrder.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: 'limit-order'
  },
  {
    path: '/limit-order',
    name: 'limit-order',
    component: LimitOrder
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
