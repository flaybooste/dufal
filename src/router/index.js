import { createRouter, createWebHistory } from 'vue-router'
import XmlView from '@/views/XmlView.vue'
import HomeView from '@/views/HomeView.vue'
import PlanilhasComponent from '@/components/PlanilhasComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  {
    path: "/xml",
    name: "xml",
    component: XmlView,
  },
  {
    path: "/planilhas",
    name: "planilhas",
    component: PlanilhasComponent
  }
  ],
})

export default router
