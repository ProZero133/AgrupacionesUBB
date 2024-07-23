// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/',
      redirect: '/api/home',
    },
    {
      path: '/api',
      component: () => import('@/layouts/default/Dashboard.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/UserHomeView.vue'),
        },
        {
          path: 'adminhome',
          name: 'AdminHome',
          component: () => import('@/views/AdminHome.vue'),
        },
        {
          path: 'verificaciones',
          name: 'Verificaciones',
          component: () => import('@/views/VerificacionesView.vue'),
        },
        {
          path: 'crear_actividad',
          name: 'Crear Actividad',
          component: () => import('@/views/CrearActividadView.vue'),
        },
        {
          path: 'crear_agrupacion',
          name: 'Crear Agrupacion',
          component: () => import('@/views/CrearAgrupacionView.vue'),
        },
        {
          path: 'crear_publicacion',
          name: 'Crear Publicacion',
          component: () => import('@/views/CrearPublicacionView.vue'),
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/LoginView.vue'),
        },
        {
          path: 'grupo/:id', // Add the dynamic segment :id
          name: 'Grupo',
          component: () => import('@/views/GrupoView.vue'),
        },
        {
          path: 'buscador_agrupaciones',
          name: 'Buscador Agrupaciones',
          component: () => import('@/views/BuscadorAgrupaciones.vue'),
        },
      ],
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
