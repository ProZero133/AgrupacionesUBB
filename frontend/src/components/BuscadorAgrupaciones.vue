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

              <v-card-title>
                {{ item.title }}
              </v-card-title>
              <v-btn icon size="x" @click="abrirDialogReportar(item.idAgrupacion)"
                style="position: absolute; top: 0; right: 0;">
                <v-icon size="x-large" color="red">mdi-alert-octagon</v-icon>
              </v-btn>
            </v-img>

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

      <v-dialog v-model="dialogReportar" max-width="500px" min-width="400px">
        <v-card>
            <v-card-title class="acred ml-3" style="text-align: center;">
            Agrupacion: " {{ selectedAgrupacion.title }} "
          </v-card-title>

            <v-alert type="warning" class="mb-4 d-flex justify-center" style="text-align: justify;">
              Estas a punto de reportar a una agrupacion. Este correo se le enviará a los administradores de la plataforma.
                Por motivos de <strong>moderación</strong>, se enviara su nombre junto al motivo del reporte hacia los administradores.
            </v-alert>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="motivo" label="Motivo de su reporte..." required></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="reportarAgrupacion(this.selectedAgrupacion.idAgrupacion)">Reportar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </v-tab-item>
  <v-spacer></v-spacer>
  <v-card class="footer-card" style="background-color: #014898;" dark>
    <v-container>
      <v-row justify="space-between" align="center">
        <!-- Logo -->
        <v-col cols="12" md="2">
          <img src="@/assets/escudo-monocromatico-oscuro.png" alt="Logo" width="120" height="80" />
        </v-col>
        <v-col cols="12" md="2">
          <img src="@/assets/ConectaUBB.png" alt="Logo" width="200" height="80" />
        </v-col>
        <!-- Información de contacto -->
        <v-col cols="12" md="4">
          <div class="text-center" style="color: white;">
            <p>Conectando agrupaciones y estudiantes de
              la Universidad del Bío-Bío.
            </p>
            <p>Conecta UBB es una iniciativa estudiantil,
              con apoyo de la Dirección de Desarrollo
              Estudiantil.</p>
          </div>
        </v-col>

        <!-- Redes sociales -->
        <v-col cols="12" md="4">
          <div class="text-center">
            <p style="color: white;">Si tienes dudas o consultas escríbenos a
            </p>
            <p style="color: white;">conectaubb@gmail.com
            </p>
            <p style="color: white;">Conéctate con las redes sociales de la DDE
            </p>
            <v-btn icon href="https://www.facebook.com/ddeconcepcion" target="_blank">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon href="https://x.com/ddeubiobio" target="_blank">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon href="https://www.instagram.com/ddeconcepcion/?hl=es" target="_blank">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
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
      dialogReportar: false, // Diálogo para reportar una agrupación
      motivo: '', // Motivo del reporte
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
        const response = await fetch(`${global.BACKEND_URL}/ingresarPorCodigo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({
            codigo: this.codigo,
          }),
        });
        const data = await response.json();
        // Verifica si la respuesta es exitosa
        if (response.ok) {
          this.dialogIngresar = false;
          this.$root.showSnackBar('success', "Bienvenido al grupo!", 'Código canjeado con éxito.');
          this.$router.push('/api/grupo/' + data.data.id_agr);

        } else {
          this.dialogIngresar = false;
          this.$root.showSnackBar('error', data.message, 'Código inválido o ya canjeado.');
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        // Para cada grupo, obtener VerTagsGrupo
        if (response.ok) {
          const data = await response.json();

          data.forEach((Agrupacion, index) => {
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
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + img.img, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
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
        const response = await fetch(`${global.BACKEND_URL}/enviarsolicitud/${this.rut}/${idAgrupacion}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        if (response.ok) {
          this.$root.showSnackBar('ok', 'Solicitud enviada correctamente!', 'Se le notificara al Lider sobre tu solicitud.');
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
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        this.preferencias = []; // Asegúrate de que preferencias esté vacío antes de asignar nuevos valores
        const tagsPromises = data.map(async (item) => {
          const tagResponse = await fetch(`${global.BACKEND_URL}/obtenerTagPorId/${item.id_tag}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
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

    async abrirDialogReportar(idAgrupacion) {
      this.selectedAgrupacion = this.itemsAgr.find(item => item.idAgrupacion === idAgrupacion);
      this.dialogReportar = true;
    },

    async reportarAgrupacion(idAgrupacion) {

      try {
        const response = await fetch(`${global.BACKEND_URL}/reportarAgrupacion/${idAgrupacion}/${this.rut}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({
            motivo: this.motivo,
          }),
        });

        if (response.ok) {
          this.$root.showSnackBar('success', 'Agrupación reportada correctamente!', 'Se le notificara al administrador.');
          this.dialogReportar = false;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
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
      const response = await fetch(`${global.BACKEND_URL}/buscarTags/${stringValue}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
        },
      });
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
  min-height: 400px;
  max-height: 400px;
  min-width: 300px;
  max-width: 300px;
  margin: 1%;
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
