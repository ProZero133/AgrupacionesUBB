<template>
  <v-main>
    <v-img :src="LogoPagina" max-height="150" class="mt-2"></v-img>
    <v-toolbar style="background-color: #014898;">
      <template v-slot:extension>
        <v-tabs v-model="tab" grow>
          <v-tab style="color: white;" prepend-icon="mdi-home" value="actividades">Inicio</v-tab>
          <v-tab style="color: white;" prepend-icon="mdi-account-multiple" value="misgrupos">Mis grupos</v-tab>
          <v-tab style="color: white;" prepend-icon="mdi-calendar-month" value="misActividades">Mis actividades</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <!-- Pagina Principal -->
    <v-tab-item value="actividades" v-if="tab === 'actividades'">
      <v-container cols="12">
        <v-col cols="12" class="flex-grow-0 flex-shrink-0 mb-n6 ml-n10">
          <v-card-title class="pasando">
            <span class="text-h4 textopasando">Qué está pasando?</span>
          </v-card-title>
        </v-col>
        <v-row align="start" no-gutters class="mt-6">
          <v-col v-for="elemento in elementos" :key="elemento.id" class="mb-15" border="0px" cols="12" md="6">
            <v-card rounded="xl" elevation="12" class="card-actividades" v-on:click="seleccionar(elemento.id)">
              <v-card-title>{{ elemento.tipo_elemento }}: {{ elemento.nombre }}</v-card-title>
              <v-card-subtitle class="publicadoen">Publicado en {{ grupoOrigenActividad(elemento.id_agr) }} {{
                formatearFecha(elemento.fecha_creacion) }}<br>
                <template v-if="elemento.tipo_elemento === 'Actividad'">
                  Programada para {{ formatearFecha(elemento.fecha_programada) }}
                </template>
              </v-card-subtitle>
              <v-card-text>

                <v-row>
                  <v-col cols="5">
                    <v-img class="image" aspect-ratio="1" :src='elemento.imagen' cover />
                  </v-col>
                  <v-col cols="7">
                    <p>{{ elemento.descripcion }}</p>
                  </v-col>
                </v-row>

                <v-col v-if="elemento.tipo_elemento === 'Votación'" cols="12">
                  <v-row>
                    <v-radio-group v-model="elemento.opcionPreferida" disabled>
                      <v-radio v-for="(opcion, index) in elemento.opciones" :key="index" :label="opcion.nombre"
                        :value="opcion.id_opcion">
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
      <v-container cols="12">
        <v-row align="start" no-gutters class="mt-6">
          <v-col v-for="grupo in grupos" :key="grupo.id_agr" cols="12" md="6">
            <v-card class="card-misgrupos" v-on:click="iragGrupo(grupo.id_agr)">
              <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
              <v-card-text>

                <v-row>
                  <v-col cols="4">
                    <v-img class="image" aspect-ratio="1" :src='grupo.imagen' cover />
                  </v-col>
                  <v-col cols="8">
                    <p>{{ grupo.descripcion }}</p>
                    <p>Liderado por: {{ grupo.rut }}</p>
                    <p>Fecha de creación: {{ grupo.fecha_creacion }}</p>
                  </v-col>
                </v-row>

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-tab-item>

    <v-tab-item value="misActividades" v-if="tab === 'misActividades'">
      <v-container>
        <v-row>
          <v-col v-for="elemento in actividadesParticipa" :key="elemento.id" class="mb-15" border="0px" cols="12"
            md="6">
            <v-card class="card-actividades" v-on:click="seleccionarActividad(elemento.id)">
              <v-card-title>{{ elemento.tipo_elemento }}: {{ elemento.nombre }}</v-card-title>
              <v-card-subtitle class="publicadoen">Publicado en {{ grupoOrigenActividad(elemento.id_agr) }} {{
                formatearFecha(elemento.fecha_creacion) }}</v-card-subtitle>
              <v-row>
                <v-col cols="5">
                  <v-img class="image" aspect-ratio="1" :src='elemento.imagen' cover />
                </v-col>
                <v-col cols="7">
                  <p>{{ elemento.descripcion }}</p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-tab-item>

    <v-dialog v-model="dialog">
      <v-card min-width="380" v-for="elemento in elementoFiltrado" :key="elemento.id" class="mb-15 card-actividades"
        border="10px">
        <v-card-title class="headline">{{ elemento.nombre }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-img class="image" aspect-ratio="1" :src="elemento.imagen" contain />
            </v-col>
            <v-col cols="7">
              <p>{{ elemento.descripcion }}</p>
            </v-col>

            <v-col v-if="elemento.tipo_elemento === 'Votación'" cols="12">
              <v-row>
                <v-radio-group v-model="elemento.opcionPreferida">
                  <v-radio v-for="(opcion, index) in elemento.opciones" :key="index" :label="opcion.nombre"
                    :value="opcion.id_opcion">
                  </v-radio>
                </v-radio-group>
              </v-row>
              <v-row>
                <v-btn color="primary"
                  @click="this.$root.showSnackBar('success', nom_act, 'No hay backend yupi!!!!!!');">Votar</v-btn>
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
              <v-btn :disabled="elemento.participantes >= elemento.cupos"
                :color="elemento.participantes >= elemento.cupos ? 'red' : 'green'" text
                @click="ParticiparActividad(elemento.id)">Participar</v-btn>
              <v-icon :color="elemento.participantes >= elemento.cupos ? 'red' : 'green'" class="ml-2">
                mdi-account-circle-outline
              </v-icon>
              <span>{{ elemento.participantes }} / {{ elemento.cupos }}</span>
            </v-col>
          </v-row>

          <v-row v-if="elemento.tipo_elemento === 'Formulario'">
            <v-col v-if="elemento.hipervinculo" cols="12">
              <v-btn class="text-link" :href="elemento.hipervinculo ? elemento.hipervinculo : 'https://www.google.com'"
                target="_blank" rel="noopener noreferrer" color="primary">
                Contestar formulario
              </v-btn>
            </v-col>
          </v-row>

        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogActividades">
      <v-card min-width="380" v-for="actividad in actividadFiltrada" :key="actividad.id" class="mb-15 card-actividades"
        border="10px">
        <v-card-title class="headline">{{ actividad.nombre }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-img class="image" aspect-ratio="1" :src="actividad.imagen" cover />
            </v-col>
            <v-col cols="7">
              <p>{{ actividad.descripcion }}</p>
            </v-col>

            <v-btn class="BotonAbandonar" text @mousedown="startHold" @mouseup="cancelHold" @mouseleave="cancelHold"
              @touchstart="startHold" @touchend="cancelHold" @touchcancel="cancelHold" :style="progressStyle"
              depressed>Abandonar actividad</v-btn>

          </v-row>
        </v-card-text>
        <v-card-text>
          <p style="font-size: 0.8em; color: rgba(0, 0, 0, 0.6);">
            Por favor, mantén pulsado el botón de "Abandonar actividad" para confirmar.
          </p>
        </v-card-text>
        <v-card-actions>

          <v-spacer></v-spacer>

        </v-card-actions>

      </v-card>
    </v-dialog>

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
  </v-main>

</template>

<style scoped>
.publicadoen {
  font-size: 10px;
  color: #3f3f3f;
  margin-left: 0px;
  margin-top: -10px;
  margin-bottom: -10px;
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

.image {
  width: 100%;
  height: auto;
}
</style>

<script>

import addImage from '../assets/imagePlaceholder.png';
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import conectaUBB from '../assets/ConectaUBBLine.png';
export default {
  name: 'UserHome',
  data: () => ({
    LogoPagina: conectaUBB,
    dialog: false,
    dialogActividades: false,
    grupos: [],
    actividades: [],
    publicaciones: [],
    elementos: [],
    pressTimer: null,
    pressTime: 0,
    progress: 0,
    actividadesParticipa: [],
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
    },
    progressStyle() {
      return {
        background: `linear-gradient(to right, red ${this.progress}%, white ${this.progress}%)`
      };
    },
    actividadFiltrada() {
      return this.ActividadesParticipa.filter(actividad => actividad.id_act === this.idactActual);
    },
  },

  methods: {
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
        const response = await fetch(`${global.BACKEND_URL}/obtenerGruposUsuario/${this.rut}`, {
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
          this.grupos = data;

          for (const grupo of this.grupos) {
            grupo.fecha_creacion = new Date(grupo.fecha_creacion).toLocaleDateString();
          }

          // Itera sobre cada grupo para obtener su lider con la ruta /obtenerLider/{id_agr}
          for (const grupo of this.grupos) {
            try {
              const response = await fetch(`${global.BACKEND_URL}/obtenerLider/${grupo.id_agr}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
              });
              if (response.ok) {
                const data = await response.json();
                const lider = await fetch(`${global.BACKEND_URL}/usuarioPorRut/${data.rut}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                  },
                });
                const dataLider = await lider.json();
                grupo.rut = dataLider.nombre;
              } else {
                console.error('Error en la respuesta:', response.status);
              }
            } catch (error) {
              console.error('Error al hacer fetch:', error);
            }
          }

          // Itera sobre cada grupo para obtener su imagen
          for (const grupo of this.grupos) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + grupo.imagen, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
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

    findInsertIndex(array, element) {
      let low = 0;
      let high = array.length;
      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        if (new Date(array[mid].fecha_creacion) > new Date(element.fecha_creacion)) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return low;
    },
    async CantidadParticipantes(id_act) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/obtenerParticipantes/${id_act}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success === false) {
            return 0;
          }
          return data.participantes.length;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    // Function to insert elements from array1 into array2 in sorted order
    async anadirAElementos(array) {
      for (const element of array) {
        if (element.tipo_elemento === 'Actividad') {
          const participantes = await this.CantidadParticipantes(element.id);
          element.participantes = participantes;
        }
        const index = this.findInsertIndex(this.elementos, element);
        this.elementos.splice(index, 0, element);
      }
    },

    async VerActividades() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/VerActividadesGruposUsuario/${this.rut}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        const data = await response.json();
        // Obtener actividades publicas
        const actividadesPublicas = await fetch(`${global.BACKEND_URL}/actividadesPublicas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        const dataPublicas = await actividadesPublicas.json();
        if (actividadesPublicas.ok && dataPublicas.length > 0) {
          dataPublicas.forEach((actiPublica) => {
            const index = data.findIndex((acti) => acti.id_act === actiPublica.id_act);
            if (index !== -1) {
              data.splice(index, 1);
            }
          });
          data.push(...dataPublicas);
        }

        // Añadir las actividades publicas a las actividades en data.actividades
        this.actividades = data;
        
        if (data.succes !== false) {
          for (const actis of this.actividades) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + actis.imagen, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
              });
              // Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
              if (responde.ok) {
                const dataImagen = await responde.text();
                actis.imagen = dataImagen;
              } else {
                console.error('Error en la respuesta:', responde.status);
              }
            } catch (error) {
              console.error('Error al hacer fetch:', error);
            }
          }

          // Ahora, por cada elemento en actividades, se crea un nuevo objeto con los campos que se necesitan en elementos.
          // Los campos de actividad se pasarán de la siguiente manera a elementos:
          // id_act -> id. nom_act -> nombre. descripcion -> descripcion. tipo -> tipo. imagen -> imagen. id_agr -> id_agr.
          const elementitos = await Promise.all(this.actividades.map(async (elemento) => {
            const programacion = await this.programacionActividad(elemento.id_act);
            return {
              id: elemento.id_act,
              nombre: elemento.nom_act,
              descripcion: elemento.descripcion,
              tipo: elemento.tipo,
              imagen: elemento.imagen,
              id_agr: elemento.id_agr,
              tipo_elemento: 'Actividad',
              fecha_creacion: elemento.fecha_creacion,
              cupos: elemento.cupos,
              fecha_programada: programacion ? programacion : null,
            };
          }));
          this.anadirAElementos(elementitos);
        }

        this.VerPublicaciones();
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async VerPublicaciones() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/VerPublicacionesGruposUsuario/${this.rut.trim()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success === false) {
          } else {
            this.publicaciones = data;
            for (const publis of this.publicaciones) {
              try {
                const responde = await fetch(`${global.BACKEND_URL}/imagen/` + publis.imagen, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                  },
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
                fecha_creacion: publicacion.fecha_publicacion,
              };

              if (publicacion.tipoPub === 'formulario') {
                elemento.hipervinculo = publicacion.hipervinculo;
                elemento.tipo_elemento = 'Formulario'
              } else {
                elemento.tipo_elemento = 'Publicación';
              }

              return elemento;
            });

            // Merge the new elements into the existing array
            this.anadirAElementos(nuevosElementos);
            // Sort the array by fecha_creacion date
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
      this.idactActual = id;
      this.dialog = true;
    },

    seleccionarActividad(id) {
      this.idactActual = id;
      this.dialogActividades = true;
    },
    async ParticiparActividad(id) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/participar/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          this.dialog = false;
          this.$root.showSnackBar('success', 'Te has unido a una actividad', 'Operacion exitosa');
          this.VerActividadesParticipando(this.rut);
        } else {
          console.error(data.message);
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    formatearFecha(fecha) {
      const date = new Date(fecha);
      const now = new Date();

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / 60000);

      // Verificar si la fecha es hace menos de un minuto y es antes de ahora
      if (diffInMinutes < 1 && date < now) {
        return "justo ahora";
      }

      // Verificar si la fecha es hace menos de una hora
      if (diffInMinutes < 60 && date < now) {
        return `hace ${diffInMinutes} minutos`;
      }

      // Verificar si la fecha es de hoy
      const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
      const isTomorrow = date.getDate() === now.getDate() + 1 &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return `hoy a las ${hours}:${minutes}`;
      } else if (isTomorrow) {
        return `mañana a las ${hours}:${minutes}`;
      }

      // Verificar si la fecha es de ayer
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      const isYesterday = date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isYesterday) {
        return `ayer a las ${hours}:${minutes}`;
      }

      return `el día ${day}/${month}/${year} a las ${hours}:${minutes}`;
    },

    async VerActividadesParticipando(rut) {
      try {
        // Realiza un fetch a la ruta actividadesparticipante
        const response = await fetch(`${global.BACKEND_URL}/actividadesparticipanteUsuario/${rut}`, {
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
          if (data.success === false) {
            this.ActividadesParticipa = [];
            return;
          }
          this.ActividadesParticipa = data;
          for (const actis of this.ActividadesParticipa) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + actis.imagen, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
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
          this.actividadesParticipa = this.ActividadesParticipa.map((elemento) => {
            return {
              id: elemento.id_act,
              nombre: elemento.nom_act,
              descripcion: elemento.descripcion,
              tipo: elemento.tipo,
              imagen: elemento.imagen,
              id_agr: elemento.id_agr,
              tipo_elemento: 'Actividad',
              fecha_creacion: elemento.fecha_creacion,
              cupos: elemento.cupos
            };
          });

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async abandonarActividad() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/abandonaractividad/${this.idactActual}/${this.rut}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (response.ok) {
          this.dialogActividades = false;
          this.$root.showSnackBar('success', 'Has abandonado una actividad', 'Operacion exitosa');
          this.VerActividadesParticipando(this.rut);
        } else {
          console.error(data.message);
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    startHold() {
      this.pressTime = 0;
      this.progress = 0;
      this.pressTimer = setInterval(() => {
        this.pressTime += 10;
        this.progress = (this.pressTime / 2000) * 100;
        if (this.pressTime >= 2000) {
          this.abandonarActividad();
          this.cancelHold();
        }
      }, 10);
    },
    cancelHold() {
      clearInterval(this.pressTimer);
      this.progress = 0;
    },
    async programacionActividad(id_act) {
      const response = await fetch(`${global.BACKEND_URL}/obtenerProgramacionActividad/${id_act}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.fecha[0].fecha_actividad;
      } else {
        console.error('No se encontraron programaciones para la actividad', response.status);
      }
    },
  },
  mounted() {
    this.rut = this.getRut();
    this.rol = this.getRol();
    this.VerGrupos();
    this.VerActividades();
    this.VerActividadesParticipando(this.rut);
  }
}
</script>