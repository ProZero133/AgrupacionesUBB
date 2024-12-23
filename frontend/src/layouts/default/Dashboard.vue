<template>
  <v-app>
      <!-- Toolbar -->
    <v-container>
      <v-app-bar color="#EEEEEE" density="default" class="barra">
          <v-app-bar-nav-icon
            variant="text"
            @click.stop="drawer = !drawer"
            class="mt-2"
          ></v-app-bar-nav-icon>
  
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
  
          <template v-if="$vuetify.display.mdAndUp">
            <v-list-item-content class="text-right">
              <v-list-item-title class="mt-2">{{ userNombre }}</v-list-item-title>
              <v-list-item-subtitle >{{ getRol() }}</v-list-item-subtitle>
            </v-list-item-content>
            
            <v-btn icon>
              <v-icon class="mt-2">mdi-account</v-icon>
            </v-btn>

            <v-img :src="imageSrc" max-height="50" class="mt-2"></v-img>
          </template>
      </v-app-bar>
  
      <v-navigation-drawer
      v-model="drawer"
      temporary>
        <v-list density="compact">
          <v-list-subheader>Conecta UBB</v-list-subheader>

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
  import addImage from '../../assets/v-escudo-monocromatico-negro.png';
    
    export default {
      setup() {
      return {
        imageSrc: addImage
      };
      },
      data: () => {
        return {
        drawer: true,
    
        items: [],

        allItems: [
            { name: 'Inicio', icon: 'mdi-home', path: '/api/home', tier: 1},
            { name: 'Inicio', icon: 'mdi-home', path: '/api/adminhome', tier: 2},
            { name: 'Perfil', icon: 'mdi-account', path: '/api/perfil', tier: 1},
            { name: 'Buscador Agrupaciones', icon: 'mdi-account-search', path: '/api/buscador_agrupaciones', tier: 1},
            { name: 'Crear Agrupacion', icon: 'mdi-account-multiple-plus', path: '/api/crear_agrupacion', tier: 1},
            { name: 'Verificaciones', icon: 'mdi-check', path: '/api/verificaciones', tier: 2},
            { name: 'Generar Informes', icon: 'mdi-file-document', path: '/api/generarInformes', tier: 1},
            { name: 'Logout', icon: 'mdi-login', path: '/api/login', tier: 0}, 
        ],

        userNombre: '',
        imageSrc: addImage,
        };
      },

      methods: {
        getNombre() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[1] = tokenParts[1].replace('nombre=', '');
              return tokenParts[1] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
        },

        getRol() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[0] = tokenParts[0].replace('rol=', '').trim();
              return tokenParts[0] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
        },

        filterItemsByRole() {
          const role = this.getRol();
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
        this.userNombre = this.getNombre();
        this.filterItemsByRole();
    },
  }
    </script>

<style>
.barra{
  height: 70px;
}
</style>