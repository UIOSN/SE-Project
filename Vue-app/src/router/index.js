import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // 使用相对路径更可靠
import SearchView from '../views/SearchView.vue'
import VolunteerView from '../views/VolunteerView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/volunteer',
    name: 'Volunteer',
    component: VolunteerView,
    meta: { title: 'AI志愿填报' }
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router