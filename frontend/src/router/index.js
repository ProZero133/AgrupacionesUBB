// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/api',
      component: () => import('@/layouts/default/Dashboard.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/HelloWorldView.vue'),
        },
        {
          path: 'crear_agrupacion',
          name: 'Crear Agrupacion',
          component: () => import('@/views/CrearAgrupacionView.vue'),
        },
        {
          path: 'crear_actividad',
          name: 'Crear Actividad',
          component: () => import('@/views/CrearActividadView.vue'),
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/LoginView.vue'),
        },
      ],
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router