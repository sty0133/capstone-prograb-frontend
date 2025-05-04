import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
  // 메인 페이지
  { path: '/', name: 'Home', component: HomeView },
  // 회원 관리
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router