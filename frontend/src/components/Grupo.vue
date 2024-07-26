<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-img :width="1600" :height="200" aspect-ratio="16/9" cover class="mx-auto"
      src="https://t3.ftcdn.net/jpg/04/56/11/06/360_F_456110688_0RbzwTy8UVyZwtObuxr8lb3XRr28R24X.jpg"></v-img>
    <v-card class="mx-auto px-12 py-8 texto" max-width="1600">
      <h1 class="texto">{{ datosGrupo.nombre_agr }}</h1>
      <p class="text-left">{{ datosGrupo.descripcion }}</p>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
              <v-row no-gutters>
                <v-col class="d-flex justify-start" cols="4">
                  Gestionar grupo
                </v-col>
                <v-col class="text-grey" cols="8">
                  <v-fade-transition leave-absolute>
                    <span v-if="expanded" key="0">
                      Seleccione una accion
                    </span>
                    <span v-else key="1">
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" @click="dialog = true">Ver miembros</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn color="secondary">Button 2</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn color="success">Button 3</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn color="error">Button 4</v-btn>
              </v-col>
            </v-row>

            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-toolbar color="primary">
                  <v-app-bar-nav-icon></v-app-bar-nav-icon>
                  <v-toolbar-title>Miembros</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon="mdi-magnify"></v-btn>
                  <v-btn icon="mdi-dots-vertical"></v-btn>
                  <template v-slot:extension>
                    <v-tabs v-model="tab" align-tabs="title">
                      <v-tab v-for="item in gestionmiembros" :key="item" :text="item" :value="item"></v-tab>
                    </v-tabs>
                  </template>
                </v-toolbar>

                <v-tabs-window v-model="tab">
                  <v-tabs-window-item v-for="item in gestionmiembros" :key="item" :value="item">
                    <v-card flat>
                      <v-card-text v-if="item === 'Miembros'">
                        <v-list>
                          <v-list-item v-for="(item, index) in MiembrosdeAgr" :key="index">

                            <v-list-item-title>{{ item.nombre }} <v-select class="SeleccionarRol" v-model="panita"
                                label="Seleccionar rol" density="comfortable"
                                :items="['Lider', 'Miembro Oficial', 'Miembro']" solo filled ></v-select>
                            </v-list-item-title>

                          </v-list-item>
                        </v-list>



                      </v-card-text>
                      <v-card-text v-else>
                        {{ text }}
                      </v-card-text>
                    </v-card>
                  </v-tabs-window-item>
                </v-tabs-window>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

    </v-card>

    <v-container class="titulito">
      <v-card v-for="actividad in actividades" :key="actividad.id_act" class="mb-15 card-actividades" border="10px">
        <v-card-title>{{ actividad.nom_act }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-img class="image" aspect-ratio="1" :src='actividad.imagen' />
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

  <VLayoutItem model-value position="bottom" class="text-end pointer-events-none" size="120">
    <div class="ma-9 pointer-events-initial">
      <v-menu>
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="bottom">
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
    dialog: false,
    tab: null,
    gestionmiembros: ['Miembros', 'Opción 2'],
    MiembrosdeAgr: [],
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
      verificado: null,
    },

    items: [
      { title: 'Crear Actividad', path: '/api/crear_actividad/' },
      { title: 'Crear Publicación', path: '/api/crear_publicacion/' },
      { title: 'Ver solicitudes', path: '/api/solicitudes_agrupacion/' },
      { title: 'Ver miembros', path: '/api/administrar_roles_agrupaciones/' },
    ],

    actividades: [],
    urlImagen: addImage,
  }),
  methods: {
    mergeProps,

    async ObtenerUsuariosDeAgrupacion() {
      try {
        const url = `http://localhost:3000/administracionderoles/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response);

        if (response.ok) {
          const data = await response.json();
          this.MiembrosdeAgr = data;
          this.MiembrosdeAgr.push(data);

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
        const url = `http://localhost:3000/agrupaciones/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          this.datosGrupo = data.rows[0];
          console.log("aqui datos grupo");
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
        const response = await fetch(`http://localhost:3000/actividadesgrupo/${this.groupId}`, {
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
            console.log(this.actividades[0]);

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
    this.ObtenerUsuariosDeAgrupacion();
  },
}

</script>

<style>
.tultipCrear {
  margin-bottom: 10px;
}

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