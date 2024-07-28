<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-img :width="1600" :height="200" aspect-ratio="16/9" cover class="mx-auto"
    :src=datosGrupo.imagen></v-img>
    <v-card class="mx-auto px-12 py-8 texto" max-width="1600">
      <h1 class="texto">{{ datosGrupo.nombre_agr }}</h1>
      <p class="text-left">{{ datosGrupo.descripcion }}</p>

    </v-card>

            <v-dialog v-model="dialogmiembros" max-width="600px">

              <v-card>
                <v-toolbar color="primary">
                  <template v-slot:extension>
                    <v-tabs v-model="tab" align-tabs="title">
                      <v-tab prepend-icon="mdi-account" value="miembros">Miembros</v-tab>
                      <v-tab prepend-icon="mdi-account-plus" value="solicitudes"
                        @click="VerSolicitudes">Solicitudes</v-tab>
                    </v-tabs>
                  </template>
                </v-toolbar>
                <v-card-text>

                  <v-tab-item value="miembros" v-if="tab === 'miembros'">

                    <v-data-table :headers="headers" :items="MiembrosdeAgr">
                      <template v-slot:item.action="{ item }">

                        <div class="d-flex justify-end">

                          <!-- Dialog editar -->

                          <v-dialog width="auto" scrollable>
                            <template v-slot:activator="{ props: activatorProps }">
                              <v-btn color="brown" prepend-icon="mdi-pencil" variant="outlined"
                                v-bind="activatorProps" @click="ObtenerRolUsr(item.user_rut)"></v-btn>
                            </template>

                            <template v-slot:default="{ isActive }" >
                              
                              <v-card prepend-icon="mdi-pencil" title="Editar">
                                <v-divider class="mt-3"></v-divider>

                                <v-card-text class="px-4" style="min-width: 300px; max-width: 300px">
                                  <v-radio-group v-model="selectedRole" column>
                                    <v-radio label="Líder" value="Lider"></v-radio>
                                    <v-radio label="Miembro Oficial" value="Miembro Oficial"></v-radio>
                                    <v-radio label="Miembro" value="Miembro"></v-radio>
                                  </v-radio-group>
                                </v-card-text>

                                <v-divider></v-divider>

                                <v-card-actions>
                                  <v-btn text="Cancelar" @click="isActive.value = false"></v-btn>
                                  <v-spacer></v-spacer>
                                  <v-btn color="surface-variant" text="Guardar" variant="flat"
                                    @click="CambiarRolAgrupacion(item.rut, selectedRole)"></v-btn>
                                </v-card-actions>
                              </v-card>
                            </template>
                          </v-dialog>

                          <!-- Dialog de eliminar -->
                          <v-dialog width="auto" scrollable>

                            <template v-slot:activator="{ props: activatorProps }">
                              <v-btn color="red" prepend-icon="mdi-account-cancel" variant="outlined"
                                v-bind="activatorProps"></v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                              <v-card prepend-icon="mdi-account-cancel" title="Eliminar Miembro">
                                <v-divider class="mt-3"></v-divider>

                                <v-card-text class="px-4" style="height: 150px">
                                  <p>¿Está seguro que desea eliminar a este miembro?</p>

                                  <v-row class="justify-end" style="margin-top: 10%">
                                    <v-col cols="6">
                                      <v-btn color="red"
                                        @click="EliminarMiembro(item.rut), isActive.value = false, dialog = false;">Eliminar</v-btn>
                                    </v-col>
                                    <v-col cols="4">
                                      <v-btn color="blue" @click="isActive.value = false">Cancelar</v-btn>
                                    </v-col>
                                  </v-row>
                                </v-card-text>

                              </v-card>
                            </template>
                          </v-dialog>

                        </div>
                      </template>
                    </v-data-table>

                  </v-tab-item>

                  <v-tab-item value="solicitudes" v-if="tab === 'solicitudes'">

                    <v-list>
                      <v-list-item v-for="(solicitud, index) in solicitudes" :key="index">
                        <v-menu :location="location" offset-y>
                          <template v-slot:activator="{ props }">
                            <v-btn v-bind="props">
                              {{ solicitud.rut }}
                            </v-btn>
                          </template>

                          <v-list>
                            <v-list-item v-for="(item, index) in opciones" :key="index">
                              <v-btn @click="handleOptionClick(item.title, solicitud.rut)">
                                {{ item.title }}
                              </v-btn>
                            </v-list-item>
                          </v-list>

                        </v-menu>
                      </v-list-item>
                    </v-list>
                  </v-tab-item>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialogmiembros = false">Cerrar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogeditar" max-width="500px">
              <v-card>
                <v-card-title>Editar grupo</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="datosGrupo.nombre_agr" label="Nombre" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="datosGrupo.descripcion" label="Descripción" required></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-file-input v-model="imagengrupo" accept="image/png, image/jpeg, image/bmp"
                        label="Imagen para la actividad" clearable required variant="solo-filled" prepend-icon=""
                        @change="onFileChange($event)" @click:clear="urlImagen = defaultImageUrl">
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialogeditar = false">Cancelar</v-btn>
                  <v-btn color="primary" text
                    @click="ActualizarGrupo(datosGrupo.nombre_agr, datosGrupo.descripcion, imagengrupo)">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogsolicitar" max-width="500px" min-width="400px">
              <v-card text="Solicitar acreditación">
                <v-card-title class="acred">¿Estas seguro de solicitar acreditar<br>{{ datosGrupo.nombre_agr
                  }}?</v-card-title>
                <v-card-text>
                  <!-- Confirmar si esta seguro de solicitar la acreditacion de su grupo -->
                  <v-row>
                    La agrupacion quedara sujeta a evaluacion por la administración
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialogsolicitar = false">Cancelar</v-btn>
                  <v-btn color="primary" text @click="SolicitarAcreditaciondeGrupo">Aceptar</v-btn>
                </v-card-actions>
              </v-card>

            </v-dialog>

            <v-dialog v-model="dialogeliminar" max-width="500px" min-width="400px">
              <v-card text="Eliminar agrupación">
                <v-card-title class="acred">¿Estas seguro de eliminar<br>{{ datosGrupo.nombre_agr }}?</v-card-title>
                <v-card-text>
                  <!-- Confirmar si esta seguro de eliminar su grupo -->
                  <v-row>
                    La agrupacion sera eliminada de forma permanente
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialogeliminar = false">Cancelar</v-btn>
                  <v-btn width="250px" color="primary" text @mousedown="startHold" @mouseup="cancelHold" @mouseleave="cancelHold"
                    @touchstart="startHold" @touchend="cancelHold" @touchcancel="cancelHold" :style="progressStyle"
                    depressed>Aceptar</v-btn>
                </v-card-actions>
              </v-card>
          </v-dialog>

    <!-- ACTIVIDADES Y PUBLICACIONES -->
    <v-row align="start" no-gutters class="mt-6">
      <v-col v-for="elemento in elementos" :key="elemento.id" class="mb-15" border="0px" cols="12" md="6">
        <v-card class="card-actividades">
          <v-card-title>{{ elemento.tipo_elemento }}: {{ elemento.nombre }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="5">
                <v-img class="image" aspect-ratio="1" :src='elemento.imagen' cover/>
              </v-col>
              <v-col cols="7">
                <p>{{ elemento.descripcion }}</p>
              </v-col>
            </v-row>
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
            <v-col v-if="elemento.tipo_elemento === 'votacion'" cols="12">
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>

  <!-- Botón de Crear Actividad o Publicación -->
  <VLayoutItem model-value position="bottom" class="text-end pointer-events-none" size="120">
    <div class="ma-9 pointer-events-initial">
      <v-menu>
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="start">
            <template v-slot:activator="{ props: tooltip }">
              <v-btn icon="mdi-plus" size="large" color="primary" v-bind="mergeProps(menu, tooltip)">
              </v-btn>
            </template>
            <span>Publicar</span>
          </v-tooltip>
        </template>
        <v-list class="tultipCrear">
          <v-list-item v-for="(item, index) in items" :key="index"
            v-on:click="this.$router.push(item.path + `${groupId}`)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </VLayoutItem>

  <!-- Botón de admin -->
  <VLayoutItem model-value position="bottom" class="text-end pointer-events-none mb-n10" size="120">
    <div class="ma-9 pointer-events-initial">
      <v-menu>
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="start">
            <template v-slot:activator="{ props: tooltip }">
              <v-btn icon="mdi-account-edit" size="large" color="warning" v-bind="mergeProps(menu, tooltip)">
              </v-btn>
            </template>
            <span>Moderar</span>
          </v-tooltip>
        </template>
        <v-list class="tultipCrear">
          <v-list-item v-for="(item, index) in modItems" :key="index"
            v-on:click="modalMaker(item.path)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </VLayoutItem>

</template>

<script>
import addImage from '../assets/placeholder.png';
import { useRoute } from 'vue-router';
import { mergeProps } from 'vue';
import { fa } from 'vuetify/lib/locale/index.mjs';

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
    dialogmiembros: false,
    dialogeditar: false,
    dialogsolicitar: false,
    dialogeliminar: false,
    pressTimer: null,
    pressTime: 0,
    progress: 0,
    rutactual: '20.487.563-4',
    imagengrupo: [],
    idImagen: '',
    location: 'end',
    opciones: [{ title: 'aceptar', action: 'aceptar' }, { title: 'rechazar', action: 'rechazar' }],
    tab: 'miembros',
    gestionmiembros: ['Miembros', 'Solicitudes'],
    solicitudes: [],
    MiembrosdeAgr: [],
    selectedRole: '',
    rut: '',
    rol: '',

    headers: [
      { text: 'Nombre', value: 'user_nombre' },
      { text: 'Rut', value: 'rut' },
      { text: 'Rol Agrupación', value: 'action', sortable: false },
    ],

    datosGrupo: {
      descripcion: null,
      fecha_creacion: null,
      fecha_verificacion: null,
      id_agr: null,
      imagen: null,
      nombre_agr: 'h',
      rut: null,
      verificado: null,
    },

    urlImagen: addImage,

    items: [
      { title: 'Crear Actividad', path: '/api/crear_actividad/' },
      { title: 'Crear Publicación', path: '/api/crear_publicacion/' },
      { title: 'Ver solicitudes', path: '/api/solicitudes_agrupacion/' },
      { title: 'Ver miembros', path: '/api/administrar_roles_agrupaciones/' },
    ],

    modItems: [
      { title: 'Ver Miembros', path: 'dialogmiembros' },
      { title: 'Editar Grupo', path: 'dialogeditar' },
      { title: 'Solicitar Acreditación', path: 'dialogsolicitar' },
      { title: 'Eliminar Agrupación', path: 'dialogeliminar' },
    ],

    // Lista de elementos
    // Los que son actividades, tienen los siguientes campos:
    // id_act, nom_act, descripcion, tipo, imagen, id_agr, tipo_elemento
    // Si son publicaciones, pueden tener, además, los siguientes:
    // hipervinculo, opciones (arreglo de strings)
    actividades: [],
    publicaciones: [],
    elementos: [],
    
  }),
  methods: {
    mergeProps,

    modalMaker(modal) {
      if (modal === 'dialogmiembros') {
        this.dialogmiembros = true;
      } else if (modal === 'dialogeditar') {
        console.log('dialogeditar se hace true');
        this.dialogeditar = true;
      } else if (modal === 'dialogsolicitar') {
        this.dialogsolicitar = true;
      } else if (modal === 'dialogeliminar') {
        this.dialogeliminar = true;
      }
    },

    async ObtenerUsuariosDeAgrupacion() {
      try {
        const url = `${global.BACKEND_URL}/administracionderoles/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filtrada = data.filter((item) => item.rol_agr !== 'Pendiente');
          console.log("Datos filtrados: ", filtrada);

          this.MiembrosdeAgr = filtrada;  // Solo asigna los datos filtrados
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async ObtenerRolUsr(rut) {
      console.log("Rut seleccionado: ", rut);

      try {
        const url = `${global.BACKEND_URL}/obtencionderoles/${this.groupId}/${rut}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log ("Datos de la respuesta: ", data);
          this.selectedRole = data.rol_agr;
          console.log("Rol seleccionado: ", this.selectedRole);

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },


    async CambiarRolAgrupacion(rut, rol_agr) {
      try {
        const url = `${global.BACKEND_URL}/administracionderoles/${this.groupId}/${rut}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            rol_agr }),
        });

        if (response.ok) {
          console.log("Rol actualizado correctamente.");
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async EliminarMiembro(rut) {
      try {
        const url = `${global.BACKEND_URL}/abandonaragrupacion/${this.groupId}/${rut}`;
        const response = await fetch(url, {
          method: 'DELETE',
        });
        this.ObtenerUsuariosDeAgrupacion();
        if (response.ok) {
          console.log("Usuario eliminado correctamente.");
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    selectItem(item) {
      this.selectedItems.push(item); // Añade el item a la lista de seleccionados
      //          this.searchResults = this.searchResults.filter(i => i.id !== item.id); // Elimina el item de `searchResults`
    },

    async VerGrupos() {
      try {
        // Incorpora el groupID en la URL de la solicitud fetch
        const url = `${global.BACKEND_URL}/agrupaciones/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          this.datosGrupo = data;

            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagen/` + this.datosGrupo.imagen, {
                  method: 'GET',
                });
                //Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
              if (responde.ok) {
                const dataImagen = await responde.text();
                this.datosGrupo.imagen = dataImagen;
              } else {
                console.error('Error al conseguir la imagen del grupo:', responde.status);
              }
            }
            catch (error) {
                console.error('Error al hacer fetch:', error);
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

    // Function to insert elements from array1 into array2 in sorted order
    anadirAElementos(array) {
      array.forEach(element => {
        const index = this.findInsertIndex(this.elementos, element);
        this.elementos.splice(index, 0, element);
      });
    },

    async VerActividades() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/actividadesgrupo/${this.groupId}`, {
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
          let elementosAct = this.actividades.map((elemento) => {
            return {
              id: elemento.id_act,
              nombre: elemento.nom_act,
              descripcion: elemento.descripcion,
              tipo: elemento.tipo,
              imagen: elemento.imagen,
              id_agr: elemento.id_agr,
              tipo_elemento: 'actividad',
              fecha_creacion: elemento.fecha_creacion
            };
          });

          this.anadirAElementos(elementosAct);
          }
        
        this.VerPublicaciones();

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
    // Función para ver publicaciones
    // muy similar a VerActividades, hace una llamada al backend para obtener las publicaciones con el id del grupo,
    // y las almacena en el array publicaciones. Luego, por cada publicación, se hace una llamada al backend para obtener la imagen.
    async VerPublicaciones() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/publicacionesgrupo/${this.groupId}`, {
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
                tipo_elemento: publicacion.tipoPub
              };
    
              if (publicacion.tipoPub === 'formulario') {
                elemento.hipervinculo = publicacion.hipervinculo;
              } else if (publicacion.tipoPub === 'votacion') {
                elemento.opciones = publicacion.opciones;
                elemento.opcionPreferida = '';
              }
    
              return elemento;
            });
    
            this.anadirAElementos(nuevosElementos);
          }
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async VerSolicitudes() {
      try {
        const url = `${global.BACKEND_URL}/versolicitudes/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
        });
        if (response.ok || response.status === 404) {
          const data = await response.json();
          this.solicitudes = data;
        } else {
          console.log('Error al obtener las solicitudes');
          this.solicitudes = [];
        }
      } catch (error) {
        console.log('Error al obtener las solicitudes');
        this.solicitudes = [];
      }
    },
    
    async aceptarSolicitud(rut) {
      try {
        const url = `${global.BACKEND_URL}/aceptarsolicitud/${rut}/${this.groupId}`;
        const response = await fetch(url, {
          method: 'POST',
        });
        if (response.ok) {
          console.log('Solicitud aceptada');
          this.VerSolicitudes();
          this.ObtenerUsuariosDeAgrupacion();
        } else {
          console.log('Error al aceptar la solicitud');
        }
      } catch (error) {
        console.log('Error al aceptar la solicitud');
      }
    },
    async rechazarSolicitud(rut) {
      try {
        const url = `${global.BACKEND_URL}/rechazarsolicitud/${rut}/${this.groupId}`;
        const response = await fetch(url, {
          method: 'POST',
        });
        if (response.ok) {
          console.log('Solicitud rechazada');
          this.VerSolicitudes();
        } else {
          console.log('Error al rechazar la solicitud');
        }
      } catch (error) {
        console.log('Error al rechazar la solicitud');
      }
    },
    handleOptionClick(title, rut) {
      if (title === 'aceptar') {
        console.log('aceptar');
        this.aceptarSolicitud(rut);
      } else if (title === 'rechazar') {
        console.log('rechazar');
        this.rechazarSolicitud(rut);
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) {
        this.urlImagen = this.defaultImageUrl;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        this.urlImagen = reader.result;
      };
      reader.readAsDataURL(file);
    },
    createImage(file) {
      const reader = new FileReader();
      const actualFile = file[0];
      reader.onload = e => {
        this.urlImagen = e.target.result;
      };
      if (actualFile instanceof File) {
        reader.readAsDataURL(actualFile);
      } else {
        console.error("El archivo presentado no es un archivo.");
      }
    },
    async ActualizarGrupo(nombre_agr, descripcion, imagengrupo) {
      //Realiza un fetch a la ruta para actualizar los valores del grupo
      try {
        const nombre = nombre_agr;
        const descripciongrupo = descripcion;
        const imagen = imagengrupo;
        const url = `${global.BACKEND_URL}/agrupaciones/${this.groupId}/${this.rutactual}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre_agr: nombre,
            descripcion: descripciongrupo,
          }),
        });

        if (response.ok) {
          console.log('Grupo actualizado');
          this.VerGrupos();
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }

    },

    async SolicitarAcreditaciondeGrupo () {
      try {
        const url = `${global.BACKEND_URL}/solicitaracreditacion/${this.groupId}/${this.rutactual}`;
        const response = await fetch(url, {
          method: 'PUT',
        });
        if (response.ok) {
          console.log('Solicitud enviada');
        } else {
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
          this.EliminarGrupo();
          this.cancelHold();
        }
      }, 10);
    },

    cancelHold() {
      clearInterval(this.pressTimer);
      this.progress = 0;
    },
    EliminarGrupo() {
      // Lógica para eliminar el grupo
      console.log("rut", this.rut);
      
      try {
        const url = `${global.BACKEND_URL}/eliminaragrupacion/${this.groupId}/${this.rut}`;
        const response = fetch(url, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log('Grupo eliminado');
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }

      this.dialogeliminar = false;
      this.$router.push('/api/home');
    },

  },
  mounted() {
    this.rut = this.getRut();
    this.rol = this.getRol();
    this.VerGrupos();
    this.VerActividades();
    this.ObtenerUsuariosDeAgrupacion();
    console.log(this.imageSrc);
  },
  computed: {
    progressStyle() {
      return {
        background: `linear-gradient(to right, red ${this.progress}%, white ${this.progress}%)`
      };
    },
  },
}

</script>

<style>
.tultipCrear {
  margin-bottom: 10px;
}

.titulito {
  margin-top: 0px;
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
  width: 95%;
  margin: 0 auto;
  margin-bottom: -40px;
  /* This centers the card within its container */
  border: 2px solid rgb(207, 207, 207) !important;
  min-height: 350px;
}

.SeleccionarRol {
  margin-top: 10px;
  width: 150px;
}

.div_usuarios {
  margin-left: auto;
  margin-right: auto;
}

.acred {
  white-space: pre-wrap;
  min-width: 500px;
}

.botoneliminar {
  position: relative;
  overflow: hidden;
}
</style>