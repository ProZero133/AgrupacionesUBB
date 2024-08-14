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
            <v-text-field v-model="searchQueryAgrupaciones" prepend-icon="mdi-magnify" hide-details single-line
              placeholder="Buscar Agrupacion"></v-text-field>
          </v-toolbar>
        </v-container>

        <v-divider></v-divider>

        <v-col cols="12" md="6" lg="3" v-for="(item, index) in filteredItemsAgrupaciones" :key="index">
          <v-card class="gruposCard" max-width="400">
            <v-img class="align-end text-white" height="200" :src="item.img" cover
              gradient="to bottom, rgba(255,255,255,.0), rgba(255,255,255,.0), rgba(52,62,72,.9)">
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
            <v-text-field v-model="searchQueryUsuarios" prepend-icon="mdi-magnify" hide-details single-line
              placeholder="Buscar Usuario"></v-text-field>
          </v-toolbar>
        </v-container>

        <v-divider></v-divider>

        <v-virtual-scroll :items="filteredItemsUsuarios" item-height="73">
          <template v-slot:default="{ item }">
            <v-list-item :key="item.rutUsuario" :subtitle="item.rutUsuario + ' - ' + item.correoUsuario"
              :title="item.carreraUsuario + ' - ' + item.nombreUsuario">
              <template v-slot:append>
                <v-btn icon="mdi-account-group" size="small" variant="tonal"
                  @click="ir_a_grupos_usuario(item.rutUsuario)"></v-btn>
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-row>
    </v-container>
  </v-tab-item>

  <!-- Dialogo para mostrar los grupos del usuario -->
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline">Grupos del Usuario</v-card-title>
      <v-card-text>
        <v-list v-if="gruposUsuario.length">
          <v-list-item v-for="(grupo, index) in gruposUsuario" :key="index" @click="ir_a_la_agrupacion(grupo.id_agr)">
            <v-list-item-content>
              <v-list-item-title>{{ grupo.nombre_agr }}</v-list-item-title>
              <v-list-item-subtitle>{{ grupo.verificado }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div v-else>
          <v-alert text>
            Este usuario no pertenece a ninguna Agrupación.
          </v-alert>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="#9" text @click="dialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
      dialog: false, // Controla el diálogo
      gruposUsuario: [], // Almacena los grupos del usuario seleccionado
    };
  },
  computed: {
    filteredItemsAgrupaciones() {
      if (!this.searchQueryAgrupaciones) {
        return this.itemsAgr;
      }
      const search = this.searchQueryAgrupaciones.toLowerCase();
      return this.itemsAgr.filter(item => item.title.toLowerCase().includes(search));
    },
    filteredItemsUsuarios() {
      if (!this.searchQueryUsuarios) {
        return this.itemsUsuarios;
      }
      const search = this.searchQueryUsuarios.toLowerCase();
      return this.itemsUsuarios.filter(item =>
        item.nombreUsuario.toLowerCase().includes(search) ||
        item.rutUsuario.toLowerCase().includes(search) ||
        item.correoUsuario.toLowerCase().includes(search) ||
        item.carreraUsuario.toLowerCase().includes(search)
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
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + img.img, { method: 'GET' });
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
          })).filter(item => item.rutUsuario !== '11.111.111-1'); // quita a John Doe de la lista
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async ir_a_grupos_usuario(rutUsuario) {
      this.dialog = true; // Abre el diálogo
      try {
        const response = await fetch(`${global.BACKEND_URL}/obtenerGruposUsuario/${rutUsuario}`);
        if (response.ok) {
          const data = await response.json();
          this.gruposUsuario = data; // Carga los grupos del usuario
          console.log(this.gruposUsuario);
        } else {
          this.gruposUsuario = [];
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    ir_a_la_agrupacion(idAgrupacion) {
      this.$router.push(`/api/grupo/${idAgrupacion}`);
    },

    CerrarDialog() {
      this.dialog = false; // Cierra el diálogo
      gruposUsuario = []
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
