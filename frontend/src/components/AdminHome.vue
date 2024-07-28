<template>
  <v-container class="Busqueda">
    <v-toolbar dense floating class="search-bar">
      <v-text-field v-model="searchQuery" prepend-icon="mdi-magnify" hide-details single-line
        placeholder="Buscar por agrupacion"></v-text-field>
    </v-toolbar>
  </v-container>

  <v-container>
    <v-row>
      <v-col cols="12" md="6" lg="3" v-for="(item, index) in filteredItems" :key="index">
        <v-card class="mx-auto" max-width="400">
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
</template>

<script>
export default {
  data() {
    return {
      items: [],
      searchQuery: '',
      rol: '',
      rut: '',
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      const search = this.searchQuery.toLowerCase();
      return this.items.filter(item =>
        item.title.toLowerCase().includes(search)
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
          this.items = data.map(item => ({
            title: item.nombre_agr,
            subtitle: item.verificado,
            description1: item.descripcion,
            img: item.imagen,
            idAgrupacion: item.id_agr,
          }));

          console.log('Items:', this.items);

          for (const img of this.items) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + img.img, {
                method: 'GET',
              });
              //Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
              if (responde.ok) {
                const dataImagen = await responde.text();
                img.img = dataImagen;
              } else {
                console.error('Error en la respuesta:', responde.status);
              }

            }
            catch (error) {
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
    ir_a_la_agrupacion(idAgrupacion) {
      this.$router.push(`/api/grupo/${idAgrupacion}`); 
    },
  },
  created() {
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
  margin-top: 10%;
  padding-left: 4%;
  padding-right: 4%;
}
</style>
