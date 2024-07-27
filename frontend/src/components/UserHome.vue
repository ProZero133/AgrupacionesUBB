<template>
  <v-container cols="12"></v-container>
  <v-toolbar color="primary">
      <template v-slot:extension>
        <v-tabs v-model="tab" align-tabs="title">
          <v-tab prepend-icon="mdi-bell-ring" value="actividades">Actividades</v-tab>
          <v-tab prepend-icon="mdi-account-multiple" value="misgrupos" @click="VerSolicitudes">Mis grupos</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
  <v-col cols="12" class="pagina" align-self:>
    

    


    <v-row>
      
      <v-col cols="2" class="flex-grow-0 flex-shrink-0"></v-col>
      <v-tab-item value="actividades" v-if="tab === 'actividades'">
      <v-col cols="7" class="flex-grow-0 flex-shrink-0">
        <v-card-title class="pasando">
          <span class="text-h4 textopasando">Qué está pasando?</span>
        </v-card-title>
        
        <v-card v-for="actividad in actividades" :key="actividad.id_act" class="mb-15 card-actividades" border="10px"
          v-on:click="seleccionarActividad(actividad.id_act)">
          <p class="subtitle-1 publicadoen">Publicado en {{ grupoOrigenActividad(actividad.id_agr) }}</p>
          <v-card-title>{{ actividad.nom_act }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="5">
                <v-img class="image" aspect-ratio="1" :src=actividad.imagen />
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
    </v-tab-item>
    <v-tab-item value="misgrupos" v-if="tab === 'misgrupos'">
      <v-col cols="3" class="flex-grow-0 flex-shrink-0">
        <v-card v-for="grupo in grupos" :key="grupo.id_agr" class="mb-3 card-misgrupos"
          v-on:click="iragGrupo(grupo.id_agr)">
          <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
          <v-card-text>
            <p>{{ grupo.descripcion }}</p>
            <p>RUT: {{ grupo.rut }}</p>
            <p>Fecha de creación: {{ grupo.fecha_creacion }}</p>
            <p>Verificado: {{ grupo.verificado }}</p>
            <p v-if="grupo.verificado">Fecha de verificación: {{ grupo.fecha_verificacion }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-tab-item>
    </v-row>
    <v-dialog v-model="dialogactividad">
      <v-card min-width="380" v-for="actividad in actividadFiltrada" :key="actividad.id_act"
        class="mb-15 card-actividades" border="10px">
        <v-card-title class="headline">Actividad</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-img class="image" aspect-ratio="1" :src="actividad.imagen" />
            </v-col>
            <v-col cols="7">
              <p>{{ actividad.descripcion }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col cols="6">
              <v-btn color="green darken-1" text @click="dialogactividad = false">Cerrar</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="green darken-1" text @click="ParticiparActividad(actividad.id_act)">Participar</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

    </v-dialog>
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
  min-width: 330px;
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
  min-width: 200px;
  width: 80vw;
  margin-left: 10vw;
  /* This centers the card within its container */
}

.card-actividades {
  margin-top: 40vh;
  min-width: 325px;
  /* O la altura que prefieras para tus v-card */
  width: 90%;
  margin: 0 auto;

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
import VueCookies from 'vue-cookies';
export default {
  name: 'UserHome',
  data: () => ({
    dialogactividad: false,
    grupos: [],
    actividades: [],
    urlImagen: addImage,
    idactActual: null,
    rut: '20.487.563-4',
    tab: 'actividades',
  }),
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
  computed: {
    actividadFiltrada() {
      return this.actividades.filter(actividad => actividad.id_act === this.idactActual);
    }
  },
  methods: {
    grupoOrigenActividad(id_agr) {
      // Find the grupo that matches the id_agr
      const grupo = this.grupos.find(grupo => grupo.id_agr === id_agr);
      // Return the grupo description if found, else return a default string
      return grupo ? grupo.nombre_agr : 'Grupo';
    },
    convertirImagen(data) {
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
        const response = await fetch(`http://localhost:3000/VerActividadesGruposUsuario/${this.rut}`, {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          this.actividades = data;

          for (const imagenes of this.actividades) {
            try {
              const responde = await fetch('http://localhost:3000/imagen/' + imagenes.imagen, {
                method: 'GET',
              });
              //Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
              if (responde.ok) {
                const dataImagen = await responde.text();
                imagenes.imagen = dataImagen;
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
    iragGrupo(id) {
      this.$router.push(`/api/grupo/${id}`);
    },
    seleccionarActividad(id) {
      this.idactActual = id;
      this.dialogactividad = true;
    },
    async ParticiparActividad(id) {
      try {
        console.log('Rut:', this.rut);
        console.log('ID:', id);
        const response = await fetch(`http://localhost:3000/participar/${id}/${this.rut}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (response.ok) {
          this.dialogactividad = false;
          this.$root.showSnackBar('succes', 'Te has unido a una actividad', 'Operacion exitosa');
        } else {
          console.error(data.message);
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    }
  },
  mounted() {
    this.VerGrupos();
    this.VerActividades();
  }
}


</script>
