<template>

  <v-container cols="12"></v-container>
  <v-container cols="12" >
    <v-img
        :width="1600"
        :height="200"
        aspect-ratio="16/9"
        cover
        class="mx-auto"
        src="https://t3.ftcdn.net/jpg/04/56/11/06/360_F_456110688_0RbzwTy8UVyZwtObuxr8lb3XRr28R24X.jpg"
      ></v-img>
    <v-card class="mx-auto px-12 py-8 texto" max-width="1600">
      <h1 class="texto">{{ datosGrupo.nombre_agr }}</h1>
      <p class="text-left">{{ datosGrupo.descripcion }}</p>
    </v-card>

  <v-container class="titulito">
    <v-card v-for="actividad in actividades" :key="actividad.id_act" class="mb-15 card-actividades" border="10px">
          <p class="subtitle-1 publicadoen">Publicado por John Doe en Comunidad genérica</p>
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
  </v-container>

  </v-container>

</template>

<script>
import addImage from '../assets/placeholder.png';
import { useRoute } from 'vue-router';
  
  export default {
    setup() {
    const route = useRoute();
    const groupId = route.params.id; // Access the parameter
    // You can now use groupId in your component
    console.log(groupId); // For demonstration, logs the parameter value
    

    return {
      groupId, // Return it to use in the template if needed
    };
    },
  
    data: () => ({
      panita: '',
      groupName: 'Club de Tetris UBB',
      groupDescription: 'Bienvenidos! Somos un grupo de entusiastas del Tetris que nos reunimos para jugar y compartir experiencias. Jugamos Notris, Nullpomino y PPT. Si te gusta el Tetris, no dudes en unirte a nosotros!',
      datosGrupo: {
      descripcion: null,
      fecha_creacion: null,
      fecha_verificacion: null,
      id_agr: null,
      imagen: null,
      nombre_agr: 'h',
      rut: null,
      verificado: null
      },

      actividades: [],
      urlImagen: addImage,
    }),
    methods: {
      async VerGrupos() {
        try {
          // Incorpora el groupID en la URL de la solicitud fetch
          const url = `http://localhost:3000/agrupaciones/${this.groupId}`;
          const response = await fetch(url, {
            method: 'GET',
          });
      
          // Verifica si la respuesta es exitosa
          if (response.ok) {
            // Convierte la respuesta en formato JSON
            const data = await response.json();
            console.log(data);
            this.datosGrupo = data.rows[0];
            console.log(this.datosGrupo);
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
        const response = await fetch(`http://localhost:3000/actividades/grupo/${this.groupId}`, {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          console.log(data.success);
          if (data.success === false) {
            console.log("No hay actividades");
          } else {
            console.log("Actividades obtenidas");
            console.log(response);
            this.actividades = data;
          }
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    },
    mounted() {
    this.VerGrupos();
    this.VerActividades();
    },
  }
  
</script>

<style>
.titulito {
  margin-top: -10px;
}
.texto {
  border-radius: 0px;
}

.publicadoen {
  font-size: 12px;
  color: #8d8d8d;
  margin-left: 2.5%;
  margin-top: 2%;
  margin-bottom: -1%;
}

.card-actividades {
  /* O la altura que prefieras para tus v-card */
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
  /* This centers the card within its container */
  border: 2px solid rgb(207, 207, 207) !important
}
</style>