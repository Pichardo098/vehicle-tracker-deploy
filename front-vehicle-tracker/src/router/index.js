import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

// ---------- VIEWS ------------ //
import AuthView from '@/views/AuthView.vue'
import DashboardView from '@/views/DashboardView.vue'
import VehicleDetailView from '@/views/VehicleDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: AuthView,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/vehicle/:id',
      name: 'vehicle-detail',
      component: VehicleDetailView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated()

  // If route required auth
  if (to.meta.requiresAuth && !isAuth) {
    next('/')
  } else if (to.meta.requiresGuest && isAuth) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
