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
      redirect: '/knight-moves/easy',
      component: () => import('../knight-moves/index.vue'),
      children: [
        {
          path: 'easy',
          component: () => import('../knight-moves/easy.vue')
        },
        {
          path: 'medium',
          component: () => import('../knight-moves/medium.vue')
        },
        {
          path: 'hard',
          component: () => import('../knight-moves/hard.vue')
        },
      ]
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
