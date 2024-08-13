<template>
  <v-toolbar color="primary">
    <template v-slot:extension>
      <v-tabs v-model="tab" grow>
        <v-tab prepend-icon="mdi-account-group" value="agrupaciones">Agrupaciones</v-tab>
        <v-tab prepend-icon="mdi-account-multiple" value="usuariosSistema">Usuarios</v-tab>
      </v-tabs>
    </template>
  </v-toolbar>

  <!-- Buscador de Agrupaciones -->
  <v-tab-item value="agrupaciones" v-if="tab === 'agrupaciones'">
    <v-container>
      <v-row>
        <v-container class="Busqueda">
          <v-toolbar dense floating class="search-bar">
            <v-text-field v-model="searchQueryAgrupaciones" prepend-icon="mdi-magnify" hide-details single-line placeholder="Buscar Agrupacion"></v-text-field>
          </v-toolbar>
        </v-container>

        <v-divider></v-divider>

        <v-col cols="12" md="6" lg="3" v-for="(item, index) in filteredItemsAgrupaciones" :key="index">
          <v-card class="gruposCard" max-width="400">
            <v-img class="align-end text-white" height="200" :src="item.img" cover gradient="to bottom, rgba(255,255,255,.0), rgba(255,255,255,.0), rgba(52,62,72,.9)">
              <v-card-title>{{ item.title }}</v-card-title>
            </v-img>

            <v-card-subtitle class="pt-4">
              {{ item.subtitle }}
            </v-card-subtitle>

            <v-card-text>
              <div>{{ item.description1 }}</div>
              <div>{{ item.description2 }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue" @click="ir_a_la_agrupacion(item.idAgrupacion)" text>Ir a la agrupacion</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>

  <!-- Tab de Usuarios -->
  <v-tab-item value="usuariosSistema" v-if="tab === 'usuariosSistema'">
    <v-container>
      <v-row>
        <v-container class="Busqueda">
          <v-toolbar dense floating class="search-bar">
            <v-text-field v-model="searchQueryUsuarios" prepend-icon="mdi-magnify" hide-details single-line placeholder="Buscar Usuario"></v-text-field>
          </v-toolbar>
        </v-container>

        <v-divider></v-divider>
        
        <v-virtual-scroll :items="filteredItemsUsuarios" item-height="73">
          <template v-slot:default="{ item }">
            <v-list-item :key="item.rutUsuario" :subtitle="item.carreraUsuario + ' - ' + item.correoUsuario" :title="item.nombreUsuario">
              <template v-slot:prepend>
                <!-- <v-icon class="bg-primary">mdi-account</v-icon> -->
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-row>
    </v-container>
  </v-tab-item>
</template>

<script>
export default {
  data() {
    return {
      itemsAgr: [],
      itemsUsuarios: [],
      tab: 'agrupaciones',
      searchQueryAgrupaciones: '',
      searchQueryUsuarios: '',
      rol: '',
      rut: '',
    };
  },
  computed: {
    filteredItemsAgrupaciones() {
      if (!this.searchQueryAgrupaciones) {
        return this.itemsAgr;
      }
      const search = this.searchQueryAgrupaciones.toLowerCase();
      return this.itemsAgr.filter(item =>
        item.title.toLowerCase().includes(search)
      );
    },

    filteredItemsUsuarios() {
      if (!this.searchQueryUsuarios) {
        return this.itemsUsuarios;
      }
      const search = this.searchQueryUsuarios.toLowerCase();
      return this.itemsUsuarios.filter(item =>
        item.nombreUsuario.toLowerCase().includes(search)
      );
    }
  },
  methods: {
    getRut() {
      const token = this.$cookies.get('token');
      if (token) {
        try {
          const tokenParts = token.split('&');
          tokenParts[2] = tokenParts[2].replace('rut=', '');
          return tokenParts[2];
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
          tokenParts[0] = tokenParts[0].replace('rol=', '');
          return tokenParts[0];
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
      return null;
    },
    async fetchItems() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`);
        if (response.ok) {
          const data = await response.json();
          this.itemsAgr = data.map(item => ({
            title: item.nombre_agr,
            subtitle: item.verificado,
            description1: item.descripcion,
            img: item.imagen,
            idAgrupacion: item.id_agr,
          }));

          for (const img of this.itemsAgr) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + img.img, {
                method: 'GET',
              });
              if (responde.ok) {
                const dataImagen = await responde.text();
                img.img = dataImagen;
              } else {
                console.error('Error en la respuesta:', responde.status);
              }
            } catch (error) {
              console.error('Error al hacer fetch:', error);
            }
          }

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async BuscarUsuarios() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/usuarios`);
        if (response.ok) {
          const data = await response.json();
          this.itemsUsuarios = data.map(item => ({
            nombreUsuario: item.nombre,
            rutUsuario: item.rut,
            correoUsuario: item.correo,
            carreraUsuario: item.carrera,
          }));
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    ir_a_la_agrupacion(idAgrupacion) {
      this.$router.push(`/api/grupo/${idAgrupacion}`);
    },
  },
  created() {
    this.rut = this.getRut();
    this.rol = this.getRol();
    this.fetchItems();
    this.BuscarUsuarios();
  },
};
</script>

<style scoped>
.search-bar {
  margin-top: 3000;
}

.Busqueda {
  padding-left: 10%;
  padding-right: 10%;
}

.gruposCard {
  min-height: 360px;
  max-height: 360px;
}
</style>
