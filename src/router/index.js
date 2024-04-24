import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: HomeView
      component: () => import('../views/home.vue')
    },
    {
      path: '/knight-moves',
      name: 'knight-moves',
      component: () => import('../knight-moves/index.vue')
    },
    {
      path: '/checks-n-captures',
      name: 'checks-n-captures',
      component: () => import('../checks-n-captures/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/about.vue')
    },
  ]
})

export default router
