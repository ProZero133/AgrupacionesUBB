<template>
  <v-container cols="12"></v-container>
  <v-col cols="12" class="pagina" align-self:>
    <v-row>
      <v-col cols="2" class="flex-grow-0 flex-shrink-0"></v-col>

      <v-col cols="7" class="flex-grow-0 flex-shrink-0">
        <v-card-title class="pasando">
            <span class="text-h4 textopasando">Qué está pasando?</span>
          </v-card-title>
        <v-card v-for="actividad in actividades" :key="actividad.id_act" class="mb-15 card-actividades" border="10px">
          <p class="subtitle-1 publicadoen">Publicado en {{ grupoOrigenActividad(actividad.id_agr) }}</p>
          <v-card-title>{{ actividad.nom_act }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="5">
                <v-img class="image" aspect-ratio="1" :src='urlImagen' />
              </v-col>
              <v-col cols="7">
                <p>{{ actividad.descripcion }}</p>
              </v-col>
            </v-row>
            <!-- <img :src="convertirImagen(actividad.imagen.data)" alt="Miniatura" class="miniatura"> -->
            <!--<p>Tipo: {{ actividad.tipo }}</p>-->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="3" class="flex-grow-0 flex-shrink-0">
        <v-card v-for="grupo in grupos" :key="grupo.id_agr" class="mb-3 card-misgrupos">
          <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
          <v-card-text>
            <p>{{ grupo.descripcion }}</p>
            <p>RUT: {{ grupo.rut }}</p>
            <p>Fecha de creación: {{ grupo.fecha_creacion }}</p>
            <p>Verificado: {{ grupo.verificado}}</p>
            <p v-if="grupo.verificado">Fecha de verificación: {{ grupo.fecha_verificacion }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<style scoped>
.publicadoen {
  font-size: 12px;
  color: #8d8d8d;
  margin-left: 2.5%;
  margin-top: 2%;
  margin-bottom: -1%;
}

.pasando {
  margin-left: 3%;
  margin-bottom: 6%;
}

.textopasando {
  font-weight: bold;
  color: #8d8d8d;
}

.gruparador {
  width: 95%;
  margin-bottom: 10px;
}

.pagina {
  margin-top: 30px;
  width: 90%;
}

.card-misgrupos {
  width: 80%;
  margin: 0 auto;
  /* This centers the card within its container */
}

.card-actividades {
  /* O la altura que prefieras para tus v-card */
  width: 90%;
  margin: 0 auto;
  margin-top: -40px;
  /* This centers the card within its container */
  border: 2px solid rgb(207, 207, 207) !important
}

.card-misgrupos {
  max-width: 600px;
  /* O el ancho máximo que prefieras para tus v-card */
  border: 1px solid rgb(235, 235, 235) !important
}
</style>

<script>
import addImage from '../assets/imagePlaceholder.png';
import { useRouter } from 'vue-router';

export default {
  name: 'UserHome',
  data: () => ({
    grupos: [],
    actividades: [],
    urlImagen: addImage
  }),
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
  methods: {
    grupoOrigenActividad(id_agr) {
      // Find the grupo that matches the id_agr
      const grupo = this.grupos.find(grupo => grupo.id_agr === id_agr);
      // Return the grupo description if found, else return a default string
      return grupo ? grupo.nombre_agr : 'Grupo';
    },
    convertirImagen(data) {
      console.log('Data passed to convertirImagen:', data);
    // Convertir el Proxy a un Array real si es necesario
      const dataArray = Array.isArray(data) ? data : Array.from(data);
  
      if (!dataArray || dataArray.length === 0) {
        return '';
      }
      let binary = '';
      const bytes = new Uint8Array(dataArray);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return `data:image/jpeg;base64,${window.btoa(binary)}`;
    },
    async VerGrupos() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch('http://localhost:3000/agrupaciones', {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          console.log("grupos:");
          console.log(data);
          this.grupos = data;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async VerActividades() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch('http://localhost:3000/VerActividadesGrupos', {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          console.log("actividades:");
          console.log(data);
          this.actividades = data;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    iragGrupo(id) {
      this.$router.push(`/api/grupo/${id}`);
    },
  },
  mounted() {
    this.VerGrupos();
    this.VerActividades();
  }

}


</script>
