import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import ProjectView from '@/views/ProjectView.vue'
import About from '@/views/About.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
    {
      path: '/',
      name: 'Home',
      component: ProjectView
  }, {
      path: '/project-view',
      name: 'Project View',
      component: ProjectView
  }, {
      path: '/date-view',
      name: 'Date View',
      component: About
  }, {
      path: '/history-view',
      name: 'History View',
      component: About
  },  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
