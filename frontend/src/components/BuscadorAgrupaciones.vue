<template>
  <v-container cols="12"></v-container>
  <v-col cols="12" class="pagina" align-self:>
    <v-row>
      <v-col cols="2" class="flex-grow-0 flex-shrink-0"></v-col>
      <v-col cols="7" class="flex-grow-0 flex-shrink-0">
        <v-card v-for="grupo in grupos" :key="grupo.id_agr" class="mb-15 card-grupos" border="10px">
          <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
          <!-- Contenedor flex para el contenido, empujando v-card-actions al fondo -->
          <v-card-text class="d-flex flex-column flex-grow-1">
            <div class="flex-grow-1">
              <v-img :src="grupo.imagen" alt="Miniatura" class="miniatura" max-height="200" cover></v-img>
              <p>{{ grupo.verificado }}</p>
            <div class="mb-n12">  
              <p>Tipo: {{ grupo.descripcion }}</p>
            </div>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" text @click="solicitarUnirse(grupo.id_agr)">Solicitar unirse</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<style scoped>
.pagina {
  margin-top: 60px;
  width: 90%;
}

.justify-end {
  margin-top: 17%;
}

.card-grupos {
  /* O la altura que prefieras para tus v-card */
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  margin-top: -40px;
  /* This centers the card within its container */
  border: 2px solid rgb(207, 207, 207) !important
}

</style>

<script>
export default {
  name: 'BuscadorAgrupaciones',
  data: () => ({
    grupos: [],
    rol: '',
    rut: '',
  }),
  methods: {
    getRut() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[2] = tokenParts[2].replace('rut=', '').trim();
              console.log('Token:', tokenParts[2]);
              return tokenParts[2] ;
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
              return tokenParts[0] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
        },
    async VerGrupos() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          //Obtiene la imagen para cada grupo
          const dataTransformada = [];
          for (const imagenes of data){
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagenagrupacion/`+imagenes.id_agr, {
                method: 'GET',
              });
              //Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
              if (responde.ok) {
                const dataImagen = await responde.text();
                imagenes.imagen = dataImagen;
                dataTransformada.push(imagenes);
              } else {
                console.error('Error en la respuesta:', responde.status);
              }

            }
            catch (error) {
              console.error('Error al hacer fetch:', error);
          }
        }
          this.grupos = dataTransformada;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async solicitarUnirse(id_agr){
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/enviarsolicitud/${this.rut}/${id_agr}`, {
          method: 'POST',
        });
        if (response.ok) {
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
    this.VerGrupos();
  }

}


</script>
