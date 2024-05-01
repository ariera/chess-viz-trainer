import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
          component: () => import('../knight-moves/board.vue')
        },
        {
          path: 'medium',
          component: () => import('../knight-moves/medium.vue')
        },
        {
          path: 'hard',
          component: () => import('../knight-moves/text-only.vue')
        },
      ]
    },
    {
      path: '/checks-n-captures',
      name: 'checks-n-captures',
      component: () => import('../checks-n-captures/index.vue')
    },
    {
      path: '/black-or-white',
      name: 'black-or-white',
      component: () => import('../black-or-white/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/about.vue')
    },
  ]
})

export default router
