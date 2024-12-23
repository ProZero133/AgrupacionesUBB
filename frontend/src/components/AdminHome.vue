<template>
  <v-toolbar color="primary">
    <template v-slot:extension>
      <v-tabs v-model="tab" grow>
        <v-tab prepend-icon="mdi-account-group" value="agrupaciones">Agrupaciones</v-tab>
        <v-tab prepend-icon="mdi-account-multiple" value="usuariosSistema">Usuarios</v-tab>
      </v-tabs>
    </template>
  </v-toolbar>

  <!-- Tab Buscador de Agrupaciones -->
  <v-tab-item value="agrupaciones" v-if="tab === 'agrupaciones'">
    <v-container>
      <v-row>

        <!-- BARRA DE BUSQUEDA, searchQueryAgrupaciones es la lista en al que se filtran los datos en tiempo real. -->
        <v-container class="Busqueda">
          <v-toolbar dense floating class="search-bar">
            <v-text-field v-model="searchQueryAgrupaciones" prepend-icon="mdi-magnify" hide-details single-line
              placeholder="Buscar Agrupacion"></v-text-field>
          </v-toolbar>
        </v-container>

        <v-divider></v-divider>

        <v-col cols="12" md="6" lg="3" v-for="(item, index) in filteredItemsAgrupaciones" :key="index">
          <v-card class="gruposCard" max-width="400" @click="AbrirDialogAgrupacion(item.idAgrupacion)">
            <v-img class="align-end text-white" height="200" :src="item.img" cover
              gradient="to bottom, rgba(255,255,255,.0), rgba(255,255,255,.0), rgba(52,62,72,.9)">
              <v-card-title>{{ item.title }}</v-card-title>
            </v-img>
            <v-card-subtitle class="pt-4">
              <div class="d-flex justify-space-between">
                <div>Estado grupo: {{ item.verificado }}</div>
                <div>
                  <v-icon small :color="item.integrantes === 0 ? 'red' : 'primary'">mdi-account-multiple</v-icon>
                  {{ item.integrantes || 0 }}
                </div>
              </div>
            </v-card-subtitle>
            <v-card-text class="text-justify">
              {{ item.descripcion.length > 180 ? item.descripcion.slice(0, 180) + '...' : item.descripcion }}
            </v-card-text>
            <v-card-text class="TagsGrupo">
              <v-chip-group>
                <v-chip v-for="tag in item.tags" :key="tag.id_tag" class="res-tags" color="primary" text-color="white"
                  outlined>
                  {{ tag.nombre_tag }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>
    </v-container>
  </v-tab-item>

  <!-- Tab de Usuarios -->
  <v-tab-item value="usuariosSistema" v-if="tab === 'usuariosSistema'">
    <v-container>
      <v-row>
        <v-container> </v-container>

        <v-container class="Busqueda">
          <v-toolbar dense floating class="search-bar">
            <v-text-field v-model="searchQueryUsuarios" prepend-icon="mdi-magnify" hide-details single-line
              placeholder="Nombre, Rut, Carrera o Correo electronico del usuario"></v-text-field>
          </v-toolbar>
        </v-container>

        <v-divider></v-divider>

        <v-virtual-scroll :items="filteredItemsUsuarios" item-height="73">
          <template v-slot:default="{ item }">
            <v-list-item :key="item.rutUsuario" :subtitle="item.rutUsuario + ' - ' + item.correoUsuario"
              :title="item.carreraUsuario + ' - ' + item.nombreUsuario" v-if="searchQueryUsuarios !== ''">
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

  <!-- Dialogo para mostrar los detalles de la agrupación -->
  <v-dialog v-model="dialogAgrupacion" class="dialogAgrupacion">
    <v-card>
      <v-card-title class="headline">{{ selectedAgrupacion.title }}</v-card-title>
      <v-card-text>
        <v-img :src="selectedAgrupacion.img" height="300" cover></v-img>
        <v-divider></v-divider>
        <p><br><strong>Tipo de Acreditación:</strong> {{ selectedAgrupacion.verificado }}</p>
        <p><strong>Cantidad de Integrantes:</strong> {{ selectedAgrupacion.integrantes || 0 }}</p>
        <p><strong>Descripción:</strong></p>
        <p class="text-justify">{{ selectedAgrupacion.descripcion }}</p>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="blue" text @click="ir_a_agrupacion(selectedAgrupacion.idAgrupacion)">Ir a Agrupacion</v-btn>
        <v-btn color="red" text @click="dialogAgrupacion = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo para mostrar los grupos del usuario -->
  <v-dialog v-model="dialogUsuario" max-width="500">
    <v-card>
      <v-card-title class="headline">Grupos del Usuario</v-card-title>
      <v-card-text>
        <v-list v-if="gruposUsuario.length">
          <v-list-item v-for="(grupo, index) in gruposUsuario" :key="index" @click="ir_a_agrupacion(grupo.id_agr)">
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
        <v-btn color="#9" text @click="dialogUsuario = false">Cerrar</v-btn>
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
      dialogUsuario: false, // Controla el diálogo para usuarios
      dialogAgrupacion: false, // Controla el diálogo para agrupaciones
      gruposUsuario: [], // Almacena los grupos del usuario seleccionado
      selectedAgrupacion: {}, // Almacena los detalles de la agrupación seleccionada
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

    async VerTagsGrupo(id_agr) {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/obtenerTagsAgrupacion/${id_agr}`, {
          method: 'GET',
        });
        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          return data;
        } else {
          console.error('No se encontraron Tags para la agrupación', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async fetchItems() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
          method: 'GET',
        });
        // Para cada grupo, obtener VerTagsGrupo
        if (response.ok) {
          const data = await response.json();

          console.log('Data:', data);

          this.itemsAgr = await Promise.all(data.map(async item => {
            const tags = await this.VerTagsGrupo(item.id_agr);
            return {
              title: item.nombre_agr,
              verificado: item.verificado,
              descripcion: item.descripcion,
              img: item.imagen,
              idAgrupacion: item.id_agr,
              integrantes: item.integrantes,
              tags: tags, // Almacena los tags en cada agrupación
            };
          }));

          await this.ObtenerIntegrantesAgrupaciones();

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

    async ObtenerIntegrantesAgrupaciones() {

      console.log('entra en ObtenerIntegrantesAgrupaciones');

      try {
        for (const agrupacion of this.itemsAgr) {
          const response = await fetch(`${global.BACKEND_URL}/administracionderoles/${agrupacion.idAgrupacion}`, {
            method: 'GET',
          });
          if (response.ok) {
            const data = await response.json();
            agrupacion.integrantes = data.length;

            console.log('Integrantes:', agrupacion.integrantes);

          } else {
            console.error('Error en la respuesta:', response.status);
          }
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
          })).filter(item => item.rutUsuario !== '11.111.111-1'); // se pone el rut que no se muestre, en este caso, Jhon
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    AbrirDialogAgrupacion(id) {
      console.log("Entra a AbrirDialogAgrupacion");
      const agrupacion = this.itemsAgr.find(item => item.idAgrupacion === id);
      if (agrupacion) {
        this.selectedAgrupacion = agrupacion;
        this.dialogAgrupacion = true; // Abre el diálogo con los detalles
      }
    },

    async ir_a_grupos_usuario(rut) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/obtenerGruposUsuario/${rut}`);
        if (response.ok) {
          const data = await response.json();
          this.gruposUsuario = data.map(item => ({
            nombre_agr: item.nombre_agr,
            verificado: item.verificado,
            id_agr: item.id_agr,
          }));

        } else {
          console.error('Error en la respuesta:', response.status);
        }
        this.dialogUsuario = true;
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    ir_a_agrupacion(idAgrupacion) {
      this.$router.push(`/api/grupo/${idAgrupacion}`);
    },
  },

  mounted() {
    this.fetchItems();
    this.BuscarUsuarios();
    this.rut = this.getRut();
    this.rol = this.getRol();
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
  margin: 1%;
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
