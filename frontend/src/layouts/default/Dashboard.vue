<template>
  <v-app>
      <!-- Toolbar -->
    <v-container>
      <v-app-bar color="#EEEEEE" prominent>
          <v-app-bar-nav-icon
            variant="text"
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
  
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
  
          <template v-if="$vuetify.display.mdAndUp">
            <p>Marco Araneda</p>
  
            <v-btn icon>
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
      </v-app-bar>
  
      <v-navigation-drawer
      v-model="drawer"
      temporary>
        <v-list density="compact">
          <v-list-subheader>AGRUPACIONES UBB</v-list-subheader>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            :to="item.path"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-container>
    
      <router-view></router-view>
    
  </v-app>
  </template>
    <script>
    
    export default {
      data: () => ({
        drawer: true,
    
        items: [
            { name: 'Home', icon: 'mdi-home', path: '/api/home'},
            {name: 'Perfil', icon: 'mdi-account-search', path: '/api/perfil'},
            {name: 'Buscador Agrupaciones', icon: 'mdi-account-search', path: '/api/buscador_agrupaciones'},
            { name: 'Crear Agrupacion', icon: 'mdi-account-multiple-plus', path: '/api/crear_agrupacion'},
            { name: 'Crear Actividad', icon: 'mdi-calendar-plus', path: '/api/crear_actividad'},
            { name: 'Verificaciones', icon: 'mdi-check', path: '/api/verificaciones'},
            { name: 'Crear Publicacion', icon: 'mdi-newspaper-plus', path: '/api/crear_publicacion'},
            { name: 'Grupo', icon: 'mdi-account-group', path: '/api/grupo'},
            { name: 'Administrar Roles del Grupo', icon: '', path: '/api/administrar_roles_agrupaciones'},
            { name: 'Solicitar Acreditacion', icon: 'mdi-check', path: '/api/solicitar_acreditacion'},
            { name: 'Logout', icon: 'mdi-login', path: '/api/login'}, 
            
        ],
      }),
  }
    </script>
    