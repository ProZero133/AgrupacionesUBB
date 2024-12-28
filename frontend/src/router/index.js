// Composables
import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'
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
          meta: { requiresUser: true }
        },
        {
          path: 'adminhome',
          name: 'AdminHome',
          component: () => import('@/views/AdminHome.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'solicitar_acreditacion',
          name: 'SolicitarAcreditacion',
          component: () => import('@/views/SolicitarAcreditacionView.vue'),
          meta: { requiresUser: true }
        },
        {
          path: 'verificaciones',
          name: 'Verificaciones',
          component: () => import('@/views/VerificacionesView.vue'),
          meta: { requiresAdmin: true }
        },
        
        {
          path: 'crear_actividad/:id',
          name: 'Crear Actividad',
          component: () => import('@/views/CrearActividadView.vue'),
          meta: { requiresUser: true }
        },
        {
          path: 'crear_agrupacion',
          name: 'Crear Agrupacion',
          component: () => import('@/views/CrearAgrupacionView.vue'),
          meta: { requiresUser: true }
        },
        {
          path: 'crear_publicacion/:id',
          name: 'Crear Publicacion',
          component: () => import('@/views/CrearPublicacionView.vue'),
          meta: { requiresUser: true }
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/LoginView.vue'),
        },
        {
          path: 'grupo/:id/:pubid?', // Optional parameters :id and :pubid
          name: 'Grupo',
          component: () => import('@/views/GrupoView.vue'),
        },
        {
          path: 'buscador_agrupaciones',
          name: 'Buscador Agrupaciones',
          component: () => import('@/views/BuscadorAgrupacionesView.vue'),
        },
        {
          path: 'crear_tag',
          name: 'Crear Tag',
          component: () => import('@/views/CrearTagView.vue'),
          meta: { requiresUser: true }
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
        },
        {
          path: 'generarInformes',
          name: 'Generar Informes',
          component: () => import('@/views/GenerarInformesView.vue'),
        },
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

router.beforeEach((to, from, next) => {
  const publicPages = ['/api/login'];
  const authRequired = !publicPages.includes(to.path);
  const token = VueCookies.get('token');
  const tokenAuth = VueCookies.get('TokenAutorizacion');
  if (authRequired && (!token || token === 'undefined')) {
    return next('/api/login');
  }
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    const decodedToken = JSON.parse(atob(tokenAuth.split('.')[1]));
    const userRole = decodedToken.rol;
    if (userRole !== 'Admin') {
      if (to.path !== '/api/home') {
        return next('/api/home');
      }
    }
  }else{
    if (to.matched.some(record => record.meta.requiresUser)) {
      const decodedToken = JSON.parse(atob(tokenAuth.split('.')[1]));
      const userRole = decodedToken.rol;
      if (userRole !== 'Estudiante') {
        if (to.path !== '/api/adminhome') {
          return next('/api/adminhome');
        }
      }
    }
  }
  next();
})

export default router;
