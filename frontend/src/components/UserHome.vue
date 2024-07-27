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

      <!-- Actividades -->
    <v-tab-item value="actividades" v-if="tab === 'actividades'">
      <v-col cols="12" class="flex-grow-0 flex-shrink-0 mb-n10">
        <v-card-title class="pasando">
          <span class="text-h4 textopasando">Qué está pasando?</span>
        </v-card-title>
      </v-col>
      <v-container cols="12">
      <v-row align="start" no-gutters class="mt-6">
        <v-col v-for="elemento in elementos" :key="elemento.id" class="mb-15" border="0px" cols="12" md="6">
          <v-card class="card-actividades" v-on:click="seleccionar(elemento.id)">
            <v-card-title>{{ elemento.tipo_elemento }}: {{ elemento.nombre }}</v-card-title>
            <v-card-text>

            <v-row>
              <v-col cols="5">
                <v-img class="image" aspect-ratio="1" :src='elemento.imagen' />
              </v-col>
              <v-col cols="7">
                <p>{{ elemento.descripcion }}</p>
              </v-col>
            </v-row>

              <v-col v-if="elemento.tipo_elemento === 'Votación'" cols="12">
                <v-row>
                  <v-radio-group v-model="elemento.opcionPreferida" disabled>
                    <v-radio v-for="(opcion, index) in elemento.opciones" :key="index" :label="opcion.nombre" :value="opcion.id_opcion">
                    </v-radio>
                  </v-radio-group>
                </v-row>
              </v-col>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      </v-container>
    </v-tab-item>

    <!-- Mis grupos -->
    <v-tab-item value="misgrupos" v-if="tab === 'misgrupos'">
      <v-col cols="12" class="flex-grow-0 flex-shrink-0 mb-n4">
      </v-col>
      <v-col v-for="grupo in grupos" :key="grupo.id_agr" cols="12" md="6">
        <v-card class="card-misgrupos" v-on:click="iragGrupo(grupo.id_agr)">
          <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
            <v-card-text>

              <v-row>
                <v-col cols="4">
                  <v-img class="image" aspect-ratio="1" :src='grupo.imagen' />
                </v-col>
                <v-col cols="8">
                  <p>{{ grupo.descripcion }}</p>
                  <p>RUT: {{ grupo.rut }}</p>
                  <p>Fecha de creación: {{ grupo.fecha_creacion }}</p>
                  <p>Verificado: {{ grupo.verificado }}</p>
                  <p v-if="grupo.verificado">Fecha de verificación: {{ grupo.fecha_verificacion }}</p>
                </v-col>
              </v-row>

            </v-card-text>
          </v-card>
        </v-col>
    
    </v-tab-item>

    <v-dialog v-model="dialog">
      <v-card min-width="380" v-for="elemento in elementoFiltrado" :key="elemento.id"
        class="mb-15 card-actividades" border="10px">
        <v-card-title class="headline">{{ elemento.nombre }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-img class="image" aspect-ratio="1" :src="elemento.imagen" />
            </v-col>
            <v-col cols="7">
              <p>{{ elemento.descripcion }}</p>
            </v-col>

            <v-col v-if="elemento.tipo_elemento === 'Votación'" cols="12">
              <v-row>
                <v-radio-group v-model="elemento.opcionPreferida">
                  <v-radio v-for="(opcion, index) in elemento.opciones" :key="index" :label="opcion.nombre" :value="opcion.id_opcion">
                  </v-radio>
                </v-radio-group>
              </v-row>
              <v-row>
                <v-btn color="primary" @click="this.$root.showSnackBar('success', nom_act, 'No hay backend yupi!!!!!!');">Votar</v-btn>
              </v-row>
            </v-col>

          </v-row>
        </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

          <v-row v-if="elemento.tipo_elemento === 'Actividad'">
            <v-col cols="6">
              <v-btn color="green darken-1" text @click="dialog = false">Cerrar</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="green darken-1" text @click="ParticiparActividad(actividad.id_act)">Participar</v-btn>
            </v-col>
          </v-row>

          <v-row v-if="elemento.tipo_elemento === 'Formulario'">
            <v-col v-if="elemento.hipervinculo" cols="12">
              <v-btn
                class="text-link"
                :href="elemento.hipervinculo ? elemento.hipervinculo : 'https://www.google.com'"
                target="_blank"
                rel="noopener noreferrer" 
                color="primary">
                Contestar formulario
              </v-btn>
            </v-col>
          </v-row>

      </v-card-actions>

      </v-card>

    </v-dialog>
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
  width: 100%;
}

.card-misgrupos {
  min-width: 200px;
  width: 95%;
  margin: 0 auto;
  border: 1px solid rgb(235, 235, 235) !important
}

.card-actividades {
  /* O la altura que prefieras para tus v-card */
  width: 95%;
  margin: 0 auto;
  margin-bottom: -40px;
  /* This centers the card within its container */
  border: 2px solid rgb(207, 207, 207) !important;
  min-height: 250px;
}

</style>

<script>
import addImage from '../assets/imagePlaceholder.png';
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
export default {
  name: 'UserHome',
  data: () => ({
    dialog: false,
    grupos: [],

    actividades: [],
    elementos: [],
    publicaciones: [],

    urlImagen: addImage,
    idactActual: null,
    rut: '',
    rol: '',
    tab: 'actividades',
  }),
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
  computed: {
    elementoFiltrado() {
      return this.elementos.filter(elemento => elemento.id === this.idactActual);
    }
  },
  methods: {
    getRut() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[2] = tokenParts[2].replace('rut=', '');
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
        console.log('llamando a VerGrupos');
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
          method: 'GET',
        });
    
        console.log("esta es la respuesta ", response);
    
        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          this.grupos = data;
    
          // Itera sobre cada grupo para obtener su imagen
          for (const grupo of this.grupos) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + grupo.imagen, {
                method: 'GET',
              });
              // Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
              if (responde.ok) {
                const dataImagen = await responde.text();
                grupo.imagen = dataImagen;
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

    async VerActividades() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/VerActividadesGruposUsuario/${this.rut}`, {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          //console.log(data.success);
          if (data.success === false) {
            //console.log("No hay actividades");
          } else {
            this.actividades = data;
            for (const actis of this.actividades) {
              try {
                const responde = await fetch(`${global.BACKEND_URL}/imagen/` + actis.imagen, {
                  method: 'GET',
                });
                //Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
                if (responde.ok) {
                  const dataImagen = await responde.text();
                  actis.imagen = dataImagen;
                } else {
                  console.error('Error en la respuesta:', responde.status);
                }

              }
              catch (error) {
                console.error('Error al hacer fetch:', error);
              }
            }

          // Ahora, por cada elemento en actividades, se crea un nuevo objeto con los campos que se necesitan en elementos.
          // Los campos de actividad se pasarán de la siguiente manera a elementos:
          // id_act -> id. nom_act -> nombre. descripcion -> descripcion. tipo -> tipo. imagen -> imagen. id_agr -> id_agr.
          this.elementos = this.actividades.map((elemento) => {
            return {
              id: elemento.id_act,
              nombre: elemento.nom_act,
              descripcion: elemento.descripcion,
              tipo: elemento.tipo,
              imagen: elemento.imagen,
              id_agr: elemento.id_agr,
              tipo_elemento: 'Actividad',
            };
          });
          }
        
        this.VerPublicaciones();

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async VerPublicaciones() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/publicacionesgrupo/${32}`, {
          method: 'GET',
        });
    
        if (response.ok) {
          const data = await response.json();
          if (data.success === false) {
            //console.log("No hay publicaciones");
          } else {
            this.publicaciones = data;
            console.log("this.publicaciones");
            console.log(this.publicaciones);
            for (const publis of this.publicaciones) {
              try {
                const responde = await fetch(`${global.BACKEND_URL}/imagen/` + publis.imagen, {
                  method: 'GET',
                });
                if (responde.ok) {
                  const dataImagen = await responde.text();
                  publis.imagen = dataImagen;
                } else {
                  console.error('Error en la respuesta:', responde.status);
                }
              } catch (error) {
                console.error('Error al hacer fetch:', error);
              }
            }
    
            const nuevosElementos = this.publicaciones.map(publicacion => {
              const elemento = {
                id: publicacion.id_pub,
                nombre: publicacion.encabezado,
                descripcion: publicacion.descripcion,
                imagen: publicacion.imagen,
                id_agr: publicacion.id_agr,
              };
    
              if (publicacion.tipoPub === 'formulario') {
                elemento.hipervinculo = publicacion.hipervinculo;
                elemento.tipo_elemento = 'Formulario'
              } else if (publicacion.tipoPub === 'votacion') {
                elemento.opciones = publicacion.opciones;
                elemento.opcionPreferida = '';
                elemento.tipo_elemento = 'Votación';
              } else {
                elemento.tipo_elemento = 'Publicación';
              }
    
              return elemento;
            });
    
            this.elementos = [...this.elementos, ...nuevosElementos];
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

    seleccionar(id) {
      console.log('Seleccionar:', id);
      console.log('this.dialog:', this.dialog);
      this.idactActual = id;
      this.dialog = true;
    },

    async ParticiparActividad(id) {
      try {
        console.log('Rut:', this.rut);
        console.log('ID:', id);
        const response = await fetch(`${global.BACKEND_URL}/participar/${id}/${this.rut}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (response.ok) {
          this.dialog = false;
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
    this.rut = this.getRut();
    this.rol = this.getRol();
    this.VerGrupos();
    this.VerActividades();
  }
}


</script>