// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/',
      redirect: '/api/login'
    },
    {
      path: '/api/crear_actividad',
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
          path: 'solicitar_acreditacion',
          name: 'SolicitarAcreditacion',
          component: () => import('@/views/SolicitarAcreditacionView.vue'),
        },
        {
          path: 'verificaciones',
          name: 'Verificaciones',
          component: () => import('@/views/VerificacionesView.vue'),
        },
        {
          path: 'administrar_roles_agrupaciones/:id',
          name: 'Administrar_Roles_Agrupaciones',
          component: () => import('@/views/AdministrarRolesAgrupacionesview.vue'),
        },
        {
          path: 'crear_actividad/:id',
          name: 'Crear Actividad',
          component: () => import('@/views/CrearActividadView.vue'),
        },
        {
          path: 'crear_agrupacion',
          name: 'Crear Agrupacion',
          component: () => import('@/views/CrearAgrupacionView.vue'),
        },
        {
          path: 'crear_publicacion/:id',
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
          component: () => import('@/views/BuscadorAgrupacionesView.vue'),
        },
        {
          path: 'solicitudes_agrupacion/:id_agr',
          name: 'Solicitudes Agrupacion',
          component: () => import('@/views/SolicitudesAgrupacionView.vue'),
        },
        {
         path: 'perfil',
          name: 'Perfil',
          component: () => import('@/views/PerfilUsuarioView.vue'), 
        }
        
      ],
    },
    {
      path: '/api/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router;
