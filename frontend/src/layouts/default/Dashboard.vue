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
    
        items: [],

        allItems: [
            { name: 'Home', icon: 'mdi-home', path: '/api/home', tier: 0},
            { name: 'Perfil', icon: 'mdi-account-search', path: '/api/perfil', tier: 0},
            { name: 'Buscador Agrupaciones', icon: 'mdi-account-search', path: '/api/buscador_agrupaciones', tier: 0},
            { name: 'Crear Agrupacion', icon: 'mdi-account-multiple-plus', path: '/api/crear_agrupacion', tier: 0},
            { name: 'Verificaciones', icon: 'mdi-check', path: '/api/verificaciones', tier: 2},
            { name: 'Solicitar Acreditacion', icon: 'mdi-check', path: '/api/solicitar_acreditacion',tier: 1},
            { name: 'Logout', icon: 'mdi-login', path: '/api/login', tier: 0}, 
            
        ],
      }),

      methods: {
        getRol() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('=');
              return tokenParts[1] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
        },
        filterItemsByRole() {
          const role = this.getRol();
          console.log(role);
          this.items = this.allItems.filter(item => {
                switch (role) {
                    case 'Admin':
                        return item.tier !== 1;
                    case 'Estudiante':
                        return item.tier === 0 || item.tier=== 1;
                    default:
                        return item.tier === 0;
                }
            }).map(({ name, icon, path }) => ({ name, icon, path }));
        },
    },

    created() {
        this.filterItemsByRole();
    },
  }
    </script>