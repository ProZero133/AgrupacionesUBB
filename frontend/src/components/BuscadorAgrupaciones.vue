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
export default {
  data() {
    return {
      itemsAgr: [],
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
      if (!this.searchQueryAgrupaciones) {
        return this.itemsAgr;
      }
      const search = this.searchQueryAgrupaciones.toLowerCase();
      return this.itemsAgr.filter(item => item.title.toLowerCase().includes(search));
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

    async fetchItems() {
      try {

        console.log('rut', this.rut);
        console.log('rol', this.rol);

        const response = await fetch(`${global.BACKEND_URL}/agrupacionesnoinscritas/${this.rut}`, {
          method: 'GET',
        });

        console.log("respoonse", response);
        
        if (response.ok) {
          const data = await response.json();

          this.itemsAgr = data.map(item => ({
            title: item.nombre_agr,
            verificado: item.verificado,
            descripcion: item.descripcion,
            img: item.imagen,
            idAgrupacion: item.id_agr,
            integrantes: item.integrantes,
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
    }

  },
  mounted() {
    
    this.rut = this.getRut();
    this.rol = this.getRol();
    this.fetchItems();
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
