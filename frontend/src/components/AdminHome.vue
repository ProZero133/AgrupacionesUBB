<template>
  <v-container></v-container>
  <v-img :src="LogoPagina" max-height="150" class="mt-2"></v-img>
  <v-divider></v-divider>
  <v-toolbar color="#014898">
    <template v-slot:extension>
      <v-tabs v-model="tab" grow>
        <v-tab prepend-icon="mdi-account-group" value="agrupaciones">Agrupaciones</v-tab>
        <v-tab prepend-icon="mdi-account-multiple" value="usuariosSistema">Usuarios</v-tab>
        <v-tab prepend-icon="mdi-tag" value="tags">Tags</v-tab>
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
            <v-sheet
              :color="item.visible === false ? '#E41B1A' : (item.verificado === 'Verificado' ? 'green' : '#FFCC33')"
              height="8"></v-sheet>
            <v-img class="align-end text-white" height="200" :src="item.img" cover
              :style="{ filter: item.visible === false ? 'grayscale(100%)' : 'none' }"
              gradient="to bottom, rgba(255,255,255,.0), rgba(255,255,255,.0), rgba(52,62,72,.9)">
              <v-card-title>{{ item.title }}</v-card-title>
            </v-img>
            <v-card-subtitle class="pt-4">
              <div class="d-flex justify-space-between">
                <div>Estado grupo: {{ item.visible === false ? 'invisible' : item.verificado }}</div>
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
        <v-col cols="12">
          <v-title style="font-size: 1.5rem; font-weight: bold;">Ingrese el correo de un usuario</v-title>
          <v-text-field label="Ingrese nombre.apellido" v-model="valorTextBoxUsuario"
            @keyup.enter="valorTextBoxUsuario.length >= 4 ? obteneralgo() : $root.showSnackBar('error', 'Ingrese minimo 4 caracteres')"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-data-table :headers="headersBuscadorUsuario" :items="usuariosBuscados" class="elevation-15"
          @click:row="abrirUsuarioSeleccionado">
          <template v-slot:item.correo="{ item }">
            <v-chip color="primary" dark>{{ item.correo }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn color="primary" @click="ir_a_grupos_usuario(item.rut)">Ver Grupos</v-btn>
          </template>
        </v-data-table>
      </v-row>
    </v-container>
  </v-tab-item>

  <!-- Tab de Tags -->
  <v-tab-item value="tags" v-if="tab === 'tags'">
    <!-- Columna de búsqueda y resultados -->
    <v-card>
      <v-row class="justify-center">
        <v-col cols="12" md="6">
          <!-- Barra de búsqueda -->
          <v-card class="search-container pa-3 mb-3 elevation-5">
            <v-card-title class="text-center pa-0">Tags dentro de la plataforma</v-card-title>
            <v-text-field v-model="searchQueryTags" @input="buscarTag" label="Buscar..." single-line
              hide-details></v-text-field>
          </v-card>

          <v-card class="selected-items-container pa-3 mb-3 elevation-5">
            <v-card-title class="text-center" style="font-size: 1.25rem;">
              Si desea eliminar alguno de los tags, haga click en el tag que desea eliminar.
            </v-card-title>
            <v-col>
              <v-card-text class="pa-0">
                <v-chip-group column>
                  <v-chip v-for="item in filteredTags" :key="item.id" @click="AbrirDeleteTagDialog(item)"
                    class="elevation-3" color="primary" text-color="white" outlined >
                    {{ item.nombre_tag }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-tab-item>

  <!-- Dialogo para mostrar los detalles de la agrupación -->
  <v-dialog v-model="dialogAgrupacion" class="dialogAgrupacion">
    <v-card>
      <v-card-title class="headline">{{ selectedAgrupacion.title }}</v-card-title>
      <v-card-text>
        <v-img :src="selectedAgrupacion.img" height="300" cover
          :style="{ filter: selectedAgrupacion.visible === false ? 'grayscale(100%)' : 'none' }"
          gradient="to bottom, rgba(255,255,255,.0), rgba(255,255,255,.0), rgba(52,62,72,.9)">
        </v-img>
        <v-divider></v-divider>
        <p><br><strong>Tipo de Acreditación:</strong> {{ selectedAgrupacion.visible === false ? 'invisible' :
          selectedAgrupacion.verificado }}</p>
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
      <v-card-title class="headline text-center">Grupos del Usuario</v-card-title>
      <v-card-subtitle class="text-center">
        Seleccione la agrupación a la que desea ir
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-list v-if="gruposUsuario.length">
          <v-list-item v-for="(grupo, index) in gruposUsuario" :key="index" @click="ir_a_agrupacion(grupo.id_agr)">
            <v-list-item-content>

              <v-list-item-title>{{ grupo.nombre_agr }}</v-list-item-title>
              <v-list-item-subtitle>{{ grupo.verificado }}</v-list-item-subtitle>
              <v-divider></v-divider>
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

  <!-- Dialogo para eliminar tags -->
  <v-dialog v-model="dialogEliminarTag" max-width="500">
    <v-card>
      <v-card-title class="text-center">Eliminar Tag</v-card-title>
      <v-card-text class="text-center">
        ¿Estás seguro de que deseas eliminar el tag?
      </v-card-text>

      <v-card-title class="text-center">" {{ selectedItems[0].nombre_tag }} "</v-card-title>

      <v-card-actions class="justify-center">
        <v-btn color="blue" text @click="dialogEliminarTag = false">Cancelar</v-btn>
        <v-btn color="red" text @click="eliminarTag(selectedItems[0].id_tag)">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Footer -->
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
import conectaUBB from '../assets/ConectaUBBLine.png';
export default {
  data() {
    return {
      LogoPagina: conectaUBB,
      itemsAgr: [],
      itemsUsuarios: [],
      tab: 'agrupaciones',
      searchQueryAgrupaciones: '',
      searchQueryUsuarios: '',
      rol: '',
      rut: '',
      dialogUsuario: false, // Controla el diálogo para usuarios
      dialogAgrupacion: false, // Controla el diálogo para agrupaciones
      dialogEliminarTag: false, // Controla el diálogo para eliminar tags
      gruposUsuario: [], // Almacena los grupos del usuario seleccionado
      selectedAgrupacion: {}, // Almacena los detalles de la agrupación seleccionada


      usuariosBuscados: [],
      valorTextBoxUsuario: '',
      headersBuscadorUsuario: [
        { title: 'Nombres', value: 'nombres' },
        { title: 'Primer Apellido', value: 'primer_apellido' },
        { title: 'Segundo Apellido', value: 'segundo_apellido' },
        { title: 'Correo', value: 'correo' },
        { title: 'Rol', value: 'rol' },
        { value: 'action', align: 'center' },
      ],

      // tags
      searchQueryTags: '',
      searchTagsItems: '',
      searchResults: [],
      selectedItems: [],
      tags: [],
      filteredTags: [],
      dialogTag: false,

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
        item.rutUsuario.toLowerCase().includes(search) ||
        item.rolUsuario.toLowerCase().includes(search)
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
          return [];
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
        } else {
          console.error('Error al hacer fetch:', error);
        }
      }
    },

    async fetchItems() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        // Para cada grupo, obtener VerTagsGrupo
        if (response.ok) {
          const data = await response.json();

          this.itemsAgr = await Promise.all(data.map(async item => {
            const tags = await this.VerTagsGrupo(item.id_agr);
            return {
              title: item.nombre_agr,
              verificado: item.verificado,
              descripcion: item.descripcion,
              img: item.imagen,
              idAgrupacion: item.id_agr,
              integrantes: item.integrantes,
              visible: item.visible,
              tags: tags, // Almacena los tags en cada agrupación
            };
          }));



          await this.ObtenerIntegrantesAgrupaciones();

          for (const img of this.itemsAgr) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + img.img,
                {
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

    async ObtenerIntegrantesAgrupaciones() {
      try {
        for (const agrupacion of this.itemsAgr) {
          const response = await fetch(`${global.BACKEND_URL}/obtenerUsuariosAgrupacion/${agrupacion.idAgrupacion}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            agrupacion.integrantes = data.length;

          } else {
            return 0;
          }
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async BuscarUsuarios() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/usuarios`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();

          this.itemsUsuarios = data.map(item => ({
            rutUsuario: item.rut,
            rolUsuario: item.rol,
          })); // se pone el rut que no se muestre, en este caso, Jhon
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async BuscarUsuariosBDD() {

      const response = await axios.post(`${API_ConectaUBB}/correoSubString`, {
        correo: email
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

    },

    AbrirDialogAgrupacion(id) {
      const agrupacion = this.itemsAgr.find(item => item.idAgrupacion === id);
      if (agrupacion) {
        this.selectedAgrupacion = agrupacion;
        this.dialogAgrupacion = true; // Abre el diálogo con los detalles
      }
    },

    async ir_a_grupos_usuario(rut) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/obtenerGruposUsuario/${rut}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
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

    async obteneralgo() {
      // llama a la ruta /correoSubString/:correo
      const response = await fetch(`${global.BACKEND_URL}/correoSubString/${this.valorTextBoxUsuario}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
        },
        body: JSON.stringify({
          correo: this.valorTextBoxUsuario,
        }),
      });

      if (response.ok) {
        this.usuariosBuscados = [];
        this.usuariosBuscados = await response.json();
      } else {
        console.error('No se encontraron usuarios:', response.status);
      }
    },

    // TAGS
    async TagsPlataforma() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/tags`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          this.tags = await response.json();
          this.filteredTags = this.tags; // Inicialmente, mostrar todos los tags
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    buscarTag() {
      const query = this.searchQueryTags.toLowerCase();
      this.filteredTags = this.tags.filter(tag => tag.nombre_tag.toLowerCase().includes(query));
    },

    AbrirDeleteTagDialog(item) {
      this.selectedItems = [item];
      this.dialogEliminarTag = true;
    },

    async eliminarTag(tag) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/eliminarTag/${tag}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          this.TagsPlataforma();
          this.dialogEliminarTag = false;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
  },



  mounted() {
    this.fetchItems();
    this.BuscarUsuarios();
    this.TagsPlataforma();
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
