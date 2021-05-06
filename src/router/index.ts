import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import LimitOrderV2 from '../views/LimitOrderV2.vue'
import Swap from '../views/Swap.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: 'limit-order'
  },
  {
    path: '/limit-order',
    name: 'limit-order',
    component: LimitOrderV2
  },
  {
    path: '/swap',
    name: 'swap',
    component: Swap
  }
]

const router = new VueRouter({
  routes
})

export default router
