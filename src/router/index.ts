import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
    { path: '/links', name: 'Links', component: () => import('@/views/LinksView.vue') },
    { path: '/socials', name: 'Socials', component: () => import('@/views/SocialsView.vue') },
    { path: '/donate', name: 'Donate', component: () => import('@/views/DonateView.vue') },
    { path: '/projects', name: 'Projects', component: () => import('@/views/ProjectsView.vue') }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
