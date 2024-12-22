import { createRouter, createWebHistory } from 'vue-router'
import SiegView from '@/views/SiegView.vue'
import XmlView from '@/views/XmlView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SiegView,
    },
  {
    path: "/xml",
    name: "xml",
    component: XmlView,
  }
  ],
})

export default router
