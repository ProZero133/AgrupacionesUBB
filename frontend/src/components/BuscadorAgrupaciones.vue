<template>
  <v-toolbar color="primary">
    <template v-slot:extension>
      <v-tabs v-model="tab" grow>
        <v-tab prepend-icon="mdi-account-group" value="agrupaciones">Buscador de Agrupaciones</v-tab>
      </v-tabs>
    </template>
  </v-toolbar>

  <!-- Buscador de Agrupaciones -->
  <v-tab-item value="agrupaciones" v-if="tab === 'agrupaciones'">
    <v-container>
      <v-row>

        <!-- BARRA DE BUSQUEDA, searchQueryAgrupaciones es la lista en al que se filtran los datos en tiempo real. -->
        <v-container class="Busqueda">
          <v-toolbar dense floating class="search-bar">
            <v-text-field v-model="searchQueryAgrupaciones" prepend-icon="mdi-magnify" hide-details single-line
              placeholder="Buscar Agrupacion"></v-text-field>

            <v-btn class="mt-n6" @click="dialogIngresar = true" type="submit" color="#2CA2DC">UNIRSE POR CÓDIGO</v-btn>

          </v-toolbar>
        </v-container>

        <v-divider></v-divider>

        <v-col cols="12" md="6" lg="3" v-for="(item, index) in filteredItemsAgrupaciones" :key="index">
          <v-card class="gruposCard" max-width="400">
            <v-img class="align-end text-white" height="200" :src="item.img" cover
              gradient="to bottom, rgba(255,255,255,.0), rgba(255,255,255,.0), rgba(52,62,72,.9)">
              <v-card-title>{{ item.title }}</v-card-title>
            </v-img>

            <v-card-text class="text-justify">
              {{ item.descripcion.length > 180 ? item.descripcion.slice(0, 180) + '...' : item.descripcion }}
            </v-card-text>
            <v-card-text class="TagsGrupo">
              <v-chip-group>
              <v-chip v-for="tag in item.tags" :key="tag.id_tag" class="res-tags" color="primary"
                text-color="white" outlined>
                {{ tag.nombre_tag }}
              </v-chip>
            </v-chip-group>
            </v-card-text>
            <v-card-actions class="justify-end" style="position: absolute; bottom: 0; right: 0;">
              <v-btn color="primary" text @click="solicitarUnirse(item.idAgrupacion)">Solicitar unirse</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>


      <v-dialog v-model="dialogIngresar" max-width="500px" min-width="400px">
        <v-card text="Ingresar por código de invitación enviado por correo">
          <v-card-title class="acred ml-3">Introduce el código:
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="codigo" label="Código" required></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="ingresarPorCodigo">Entrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </v-tab-item>

</template>

<script>
import { tr } from 'vuetify/lib/locale/index.mjs';

export default {
  data() {
    return {
      itemsAgr: [],
      GruposVisibles: [],
      preferencias: [],
      tab: 'agrupaciones',
      searchQueryAgrupaciones: '',
      rol: '',
      rut: '',
      dialogIngresar: false, // Diálogo para ingresar a una agrupación
      selectedAgrupacion: {}, // Almacena los detalles de la agrupación seleccionada
    };
  },
  computed: {
    filteredItemsAgrupaciones() {
      const preferenciasNombres = this.preferencias.map(tag => tag.nombre_tag);
      
      if (!this.searchQueryAgrupaciones) {
        return this.itemsAgr.sort((a, b) => {
          const aHasPreference = a.tags && a.tags.some(tag => {
            const hasPreference = preferenciasNombres.includes(tag.nombre_tag);
            return hasPreference;
          });
          const bHasPreference = b.tags && b.tags.some(tag => {
            const hasPreference = preferenciasNombres.includes(tag.nombre_tag);
            return hasPreference;
          });
          return (bHasPreference === true ? 1 : 0) - (aHasPreference === true ? 1 : 0);
        });
      }
      const search = this.searchQueryAgrupaciones.toLowerCase();
      return this.itemsAgr
        .filter(item => item.title.toLowerCase().includes(search))
        .sort((a, b) => {
          const aHasPreference = a.tags && a.tags.some(tag => {
            const hasPreference = preferenciasNombres.includes(tag.nombre_tag);
            return hasPreference;
          });
          const bHasPreference = b.tags && b.tags.some(tag => {
            const hasPreference = preferenciasNombres.includes(tag.nombre_tag);
            return hasPreference;
          });
          return (bHasPreference === true ? 1 : 0) - (aHasPreference === true ? 1 : 0);
        });
    },
  },
  methods: {
    async ingresarPorCodigo() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/ingresarPorCodigo/${this.rut}/${this.codigo}`, {
          method: 'POST',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();

          this.$root.showSnackBar('success', "Bienvenido al grupo!", 'Código canjeado con éxito.');
          this.$router.push('/api/grupo/' + data.id_agr);

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    getRut() {
      const token = this.$cookies.get('token');
      if (token) {
        try {
          const tokenParts = token.split('&');
          tokenParts[2] = tokenParts[2].replace('rut=', '').trim();
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
        const response = await fetch(`${global.BACKEND_URL}/agrupacionesnoinscritas/${this.rut}`, {
          method: 'GET',
        });
        // Para cada grupo, obtener VerTagsGrupo
        if (response.ok) {
          const data = await response.json();

          data.forEach((Agrupacion, index) => {
            console.log(`Agrupacion ${index + 1}: `, Agrupacion);
            if (Agrupacion.visible === true) {
              // añade la agrupacion al array GruposVisibles
              this.GruposVisibles.push(Agrupacion);
            }
          });

          this.itemsAgr = await Promise.all(this.GruposVisibles.map(async item => {
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



    AbrirDialogAgrupacion(id) {
      const agrupacion = this.itemsAgr.find(item => item.idAgrupacion === id);
      if (agrupacion) {
        this.selectedAgrupacion = agrupacion;
        this.dialogAgrupacion = true; // Abre el diálogo con los detalles
      }
    },

    ir_a_agrupacion(idAgrupacion) {
      this.$router.push(`/api/grupo/${idAgrupacion}`);
    },

    async solicitarUnirse(idAgrupacion) {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/enviarsolicitud/${this.rut}/${idAgrupacion}`, {
          method: 'POST',
        });

        if (response.ok) {
          this.$root.showSnackBar('ok', 'Solicitud enviada!', 'Los moderadores revisarán tu solicitud.');
          const data = await response.json();
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async obtenerPreferencias() {
            try {
                const response = await fetch(`${global.BACKEND_URL}/obtenerPreferencias/${this.rut}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error en la respuesta de la red');
                const data = await response.json();
                this.preferencias = []; // Asegúrate de que preferencias esté vacío antes de asignar nuevos valores
                const tagsPromises = data.map(async (item) => {
                    const tagResponse = await fetch(`${global.BACKEND_URL}/obtenerTagPorId/${item.id_tag}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!tagResponse.ok) throw new Error('Error al obtener tag por ID');
                    const tagData = await tagResponse.json();
                    return tagData[0]; // Asume que siempre hay al menos un elemento y toma el primero
                });
                const tags = await Promise.all(tagsPromises);

                this.preferencias = tags; // Asigna el resultado a preferencias

            } catch (error) {
                console.error('Error al obtener preferencias:', error);
            }
        },

  },
  async fetchSearchResults(searchValue) {
            // Convertir searchValue a cadena explícitamente
            const stringValue = searchValue.trim();
            if (stringValue === '') {
                this.searchResults = [];
                return;
            }
            try {
                const response = await fetch(`${global.BACKEND_URL}/buscarTags/${stringValue}`);
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                const data = await response.json();
                this.searchResults = data; // Asegúrate de que esto coincida con el formato de tu respuesta
            } catch (error) {
                console.error('Error al buscar:', error);
                this.searchResults = [];
            }
        },
  mounted() {

    this.rut = this.getRut();
    this.rol = this.getRol();
    this.fetchItems();
    this.obtenerPreferencias();
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
