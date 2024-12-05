<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-img :width="1600" :height="200" aspect-ratio="16/9" cover class="mx-auto" :src=datosGrupo.imagen></v-img>
    <v-card class="mx-auto px-12 py-8 texto" max-width="1600">
      <h1 class="texto">{{ datosGrupo.nombre_agr }}</h1>
      <p class="text-left">{{ datosGrupo.descripcion }}</p>

    </v-card>

    <v-dialog v-model="dialogmiembros" max-width="600px">

      <v-card>
        <v-toolbar color="primary">
          <template v-slot:extension>
            <v-tabs v-model="tab" grow>
              <v-tab prepend-icon="mdi-account" value="miembros">Miembros</v-tab>
              <v-tab prepend-icon="mdi-account-plus" value="solicitudes" @click="VerSolicitudes">Solicitudes</v-tab>
            </v-tabs>
          </template>
        </v-toolbar>
        <v-card-text>

          <!-- tab miembros -->
          <v-tab-item value="miembros" v-if="tab === 'miembros'">

            <v-data-table :headers="headersMiembros" :items="MiembrosdeAgr">
              <template v-slot:item.action="{ item }">

                <div class="d-flex justify-end">

                  <!-- Dialog editar -->

                  <v-dialog width="auto" scrollable>
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn color="brown" prepend-icon="mdi-pencil" variant="outlined" v-bind="activatorProps"
                        @click="ObtenerRolUsr(item.user_rut)"></v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">

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

          <!-- tab solicitudes -->
          <v-tab-item value="solicitudes" v-if="tab === 'solicitudes'">

            <v-data-table :headers="headersSolicitudes" :items="solicitudes">
              <template v-slot:item.action="{ item }">
                <div class="d-flex justify-end">

                  <!-- Dialog Aceptar -->
                  <v-dialog width="auto" scrollable>
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn color="green" prepend-icon="mdi-check" variant="outlined" v-bind="activatorProps"></v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card prepend-icon="mdi-check" title="Aceptar Solicitud">
                        <v-divider class="mt-3"></v-divider>

                        <v-card-text class="px-4" style="height: 150px">
                          <p>¿Está seguro que desea aceptar esta solicitud?</p>

                          <v-row class="justify-end" style="margin-top: 10%">
                            <v-col>
                              <v-btn color="blue"
                                @click="aceptarSolicitud(item.rut), isActive.value = false, dialog = false;">Aceptar</v-btn>
                            </v-col>
                            <v-col cols="4">
                              <v-btn color="red" @click="isActive.value = false">Cancelar</v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>

                      </v-card>
                    </template>
                  </v-dialog>

                  <!-- Dialog rechazar -->
                  <v-dialog width="auto" scrollable>
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn color="red" prepend-icon="mdi-close" variant="outlined" v-bind="activatorProps"></v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card prepend-icon="mdi-close" title="Rechazar Solicitud">
                        <v-divider class="mt-3"></v-divider>

                        <v-card-text class="px-4" style="height: 150px">
                          <p>¿Está seguro que desea rechazar esta solicitud?</p>

                          <v-row class="justify-end" style="margin-top: 10%">
                            <v-col cols="6">
                              <v-btn color="red"
                                @click="rechazarSolicitud(item.rut), isActive.value = false, dialog = false;">Rechazar</v-btn>
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

    <v-dialog v-model="dialoginvitar" max-width="500px" min-width="400px">
      <v-card text="Invitar usuarios por correo">
        <v-card-title class="acred ml-3">Introduce el correo del invitado:
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="mailInvitado" label="Correo del invitado" required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="InvitarUsuario()">Invitar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogsolicitar" max-width="500px" min-width="400px">
      <v-card text="Solicitar acreditación">
        <v-card-title class="acred">¿Estas seguro de solicitar acreditar<br>{{ datosGrupo.nombre_agr }}?</v-card-title>
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
      <v-card>
        <v-card-text class="acred" style="font-size: larger;">
          <br>Estas seguro de eliminar el grupo <br><b>{{ datosGrupo.nombre_agr }}</b></br></br>
        </v-card-text>

        <v-card-text class="text-center" style="color: #d42b08; font-weight: bold; font-size: smaller;">
          La agrupación será eliminada de forma PERMANENTE, mantenga el botón de aceptar para confirmar
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogeliminar = false">Cancelar</v-btn>
          <v-btn width="auto" color="primary" text @mousedown="startHold" @mouseup="cancelHold" @mouseleave="cancelHold"
            @touchstart="startHold" @touchend="cancelHold" @touchcancel="cancelHold" :style="progressStyle"
            depressed>Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogabandonar" max-width="500px" min-width="400px">
      <v-card text="Abandonar agrupación">
        <v-card-title class="acred">¿Estas seguro de abandonar<br>{{ datosGrupo.nombre_agr }}?</v-card-title>
        <v-card-text>
          <!-- Confirmar si esta seguro de abandonar su grupo -->
          <v-row>
            Perderas todos los privilegios dentro de la agrupación
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogabandonar = false">Cancelar</v-btn>
          <v-btn width="250px" color="primary" text @mousedown="startHoldAbandonar" @mouseup="cancelHold"
            @mouseleave="cancelHold" @touchstart="startHoldAbandonar" @touchend="cancelHold" @touchcancel="cancelHold"
            :style="progressStyle" depressed>Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPub">
      <v-card min-width="380" v-for="elemento in elementoFiltrado()" :key="elemento.id" class="mb-15 card-actividades"
        border="10px">
        <v-card-title class="headline">{{ elemento.nombre }}</v-card-title>
        <v-card-text>
          <v-row>

            <v-col cols="5">
              <v-img class="image" aspect-ratio="1" :src="elemento.imagen" cover />
            </v-col>

            <v-col cols="7">
              <p>{{ elemento.descripcion }}</p>
            </v-col>

            <v-col v-if="elemento.tipo_elemento === 'votación'" cols="12">

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

          <v-row v-if="elemento.tipo_elemento === 'actividad'">
            <v-col cols="6">
              <v-btn color="green darken-1" text @click="dialog = false">Cerrar</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="green darken-1" text @click="ParticiparActividad(elemento.id)">Participar</v-btn>
            </v-col>
          </v-row>

          <v-row v-if="elemento.tipo_elemento === 'formulario'">
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

    <!-- ACTIVIDADES Y PUBLICACIONES -->
    <v-row align="start" no-gutters class="mt-6">
      <v-col v-for="elemento in elementos" :key="elemento.id" class="mb-15" border="0px" cols="12" md="6">
        <v-card class="card-actividades" v-on:click="seleccionar(elemento.id)">
          <v-card-title>{{ elemento.tipo_elemento }}: {{ elemento.nombre }}</v-card-title>
          <v-card-subtitle class="publicadoen">Publicado {{
            formatearFecha(elemento.fecha_creacion) }}</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="5">
                <v-img class="image" aspect-ratio="1" :src='elemento.imagen' cover />
              </v-col>
              <v-col cols="7">
                <p>{{ elemento.descripcion }}</p>
              </v-col>
            </v-row>
            <v-col v-if="elemento.hipervinculo" cols="12">
              <v-btn class="text-link" :href="elemento.hipervinculo ? elemento.hipervinculo : 'https://www.google.com'"
                target="_blank" rel="noopener noreferrer" color="primary">
                Contestar formulario
              </v-btn>
            </v-col>
            <v-col v-if="elemento.tipo_elemento === 'votacion'" cols="12">
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>

  <!-- Botón de Crear Actividad o Publicación -->
  <VLayoutItem v-if="rolA" model-value position="bottom" class="text-end pointer-events-none" size="120">
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

          <v-list-item v-for="(item, index) in itemsFiltroRol" :key="index"
            v-on:click="this.$router.push(item.path + `${groupId}`)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="abandonarItem" v-on:click="this.dialogabandonar = true">
            <v-list-item-title>Abandonar agrupación</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-menu>
    </div>
  </VLayoutItem>

  <!-- Botón de admin -->
  <VLayoutItem v-if="adminOlider" model-value position="bottom" class="text-end pointer-events-none mb-n10" size="120">
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
          <v-list-item v-for="(item, index) in modItems" :key="index" v-on:click="modalMaker(item.path)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </VLayoutItem>

  <VLayoutItem v-if="adminOlider" model-value position="top" class="text-end pointer-events-none mb-n10" size="120">
    <div class="ma-9 pointer-events-initial">
      <v-menu>
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="start">
            <template v-slot:activator="{ props: tooltip }">
              <v-btn icon="mdi-cog" size="large" color="gray" v-bind="mergeProps(menu, tooltip)">
              </v-btn>
            </template>
            <span>Apariencia</span>
          </v-tooltip>
        </template>
        <v-list class="tultipApariencia">
          <v-list-item v-for="(item, index) in aparienciaItems" :key="index"
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

    return {
      groupId, // Return it to use in the template if needed
    };
  },

  data: () => ({
    lider: false,
    adminOlider: false,
    rolEnAgrupacion: '',
    dialogmiembros: false,
    dialogeditar: false,
    dialogsolicitar: false,
    dialogeliminar: false,
    dialoginvitar: false,
    dialogabandonar: false,
    dialogPub: false,

    pressTimer: null,
    pressTime: 0,
    progress: 0,
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
    rolA: false,

    idactActual: null,

    headersMiembros: [
      { title: 'Nombre', value: 'user_nombre', sortable: true },
      { title: 'Rut', value: 'rut', sortable: true },
      { value: 'action', sortable: false },
    ],

    headersSolicitudes: [
      { title: 'Nombre', value: 'nombre', sortable: true },
      { title: 'Rut', value: 'rut', sortable: true },
      { value: 'action', sortable: false },
    ],

    datosGrupo: {
      descripcion: null,
      fecha_creacion: null,
      fecha_verificacion: null,
      id_agr: null,
      imagen: null,
      nombre_agr: '',
      rut: null,
      verificado: null,
    },

    urlImagen: addImage,

    items: [
      { title: 'Crear Actividad', path: '/api/crear_actividad/' },
      { title: 'Crear Publicación', path: '/api/crear_publicacion/' },
      { title: 'Abandonar Agrupación', path: '/api/abandonaragrupacion/' },
    ],
    itemsSegunRol: [
      { title: 'Crear Actividad', path: '/api/crear_actividad/', roles: ['Lider', 'Miembro oficial'] },
      { title: 'Crear Publicación', path: '/api/crear_publicacion/', roles: ['Lider'] },
      { title: 'Abandonar Agrupación', path: 'dialogabandonar', roles: ['Lider', 'Miembro oficial', 'Miembro'] },
    ],

    modItems: [
      { title: 'Ver Miembros', path: 'dialogmiembros', tier: 1 },
      { title: 'Editar Grupo', path: 'dialogeditar', tier: 0 },
      { title: 'Solicitar Acreditación', path: 'dialogsolicitar', tier: 0 },
      { title: 'Eliminar Agrupación', path: 'dialogeliminar', tier: 1 },
      { title: 'Invitar Usuarios', path: 'dialoginvitar', tier: 1 },
    ],

    aparienciaItems: [
      { title: 'Cambiar Fondo', roles: ['Lider'] },
      { title: 'Cambiar Fondo descripción', roles: ['Lider'] },
      { title: 'Cambiar Bordes actividades', roles: ['Lider'] },
    ],

    // Lista de elementos
    // Los que son actividades, tienen los siguientes campos:
    // id_act, nom_act, descripcion, tipo, imagen, id_agr, tipo_elemento
    // Si son publicaciones, pueden tener, además, los siguientes:
    // hipervinculo, opciones (arreglo de strings)
    actividades: [],
    publicaciones: [],
    elementos: [],

    mailInvitado: '',

  }),
  methods: {
    mergeProps,

    seleccionar(id) {
      this.idactActual = id;
      this.dialogPub = true;
    },

    async ParticiparActividad(id) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/participar/${id}/${this.rut}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (response.ok) {
          this.dialogPub = false;
          this.$root.showSnackBar('succes', 'Te has unido a una actividad', 'Operacion exitosa');
        } else {
          console.error(data.message);
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    elementoFiltrado() {
      let coso = this.elementos.filter(elemento => elemento.id === this.idactActual);
      return coso;
    },

    async InvitarUsuario() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/invitarUsuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mail: this.mailInvitado, id_agr: this.datosGrupo.id_agr, nombre_agr: this.datosGrupo.nombre_agr }),
        });
        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          this.$root.showSnackBar('', 'Usuario invitado con éxito!');
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    modalMaker(modal) {
      if (modal === 'dialogmiembros') {
        this.dialogmiembros = true;
      } else if (modal === 'dialogeditar') {
        this.dialogeditar = true;
      } else if (modal === 'dialogsolicitar') {
        this.dialogsolicitar = true;
      } else if (modal === 'dialogeliminar') {
        this.dialogeliminar = true;
      } else if (modal === 'dialoginvitar') {
        this.dialoginvitar = true;
      }
    },

    filterItemsByRole() {
      const role = this.getRol();
      this.items = this.allItems.filter(item => {
        switch (role) {
          case 'Admin':
            return item.tier !== 0;
          case 'Estudiante':
            return item.tier === 0 || item.tier === 1;
          default:
            return item.tier === 0;
        }
      }).map(({ name, icon, path }) => ({ name, icon, path }));
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
          const filtrada = data.filter((item) => item.rol_agr !== 'Pendiente' & item.rut !== "11.111.111-1");
          this.MiembrosdeAgr = filtrada;  // Solo asigna los datos filtrados
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

    async esMiembro() {
      const rutMiembro = this.getRut(); // Ensure rutMiembro is properly scoped
      try {
        const url = `${global.BACKEND_URL}/obtenerRolUsuario/${rutMiembro}/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.rol_agr === 'Miembro' || data.rol_agr === 'Miembro Oficial' || data.rol_agr === 'Lider') {
            this.rolA = true;
            this.rolEnAgrupacion = data.rol_agr;
          } else {
            this.rolA = false;
          }
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        this.$root.showSnackBar('error', 'Seguro que eres parte de este grupo?', 'Error de carga de datos');
        console.error('Error al obtener el rol:', error);
      }
    },

    async ObtenerLider() {
      const rutLider = this.getRut(); // Ensure rutLider is properly scoped
      try {
        const url = `${global.BACKEND_URL}/obtenerLider/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.rut === rutLider) {
            this.lider = true;
          } else {
            this.lider = false;
          }
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al obtener el líder:', error);
      }
    },
    async esAdminOLider() {
      this.rol = this.getRol();
      this.rut = this.getRut();
      await this.ObtenerLider();
      if (this.rol === 'Admin' || this.lider === true) {
        return this.adminOlider = true;
      } else {
        return this.adminOlider = false;
      }
    },

    async ObtenerRolUsr(rut) {
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
          this.selectedRole = data.rol_agr;
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
            rol_agr
          }),
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
        const miembroRut = rut || this.rut;
        const url = `${global.BACKEND_URL}/abandonaragrupacion/${this.groupId}/${miembroRut}`;
        const response = await fetch(url, {
          method: 'DELETE',
        });
        this.ObtenerUsuariosDeAgrupacion();
        if (response.ok) {
          console.log("Usuario eliminado correctamente.");
          this.$router.push('/api/home');
        } else {
          console.error('Error en la respuesta:', response.status);
          this.$router.push('/api/home');
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    selectItem(item) {
      this.selectedItems.push(item); // Añade el item a la lista de seleccionados
      //this.searchResults = this.searchResults.filter(i => i.id !== item.id); // Elimina el item de `searchResults`
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
        this.$root.showSnackBar('error', 'Este grupo no existe!', 'Error de datos');
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
                tipo_elemento: publicacion.tipoPub,
                fecha_creacion: publicacion.fecha_publicacion,
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

        const dataResponse = await response.json();

        if (response.ok || response.status === 404) {
          const solicitudes = [];
          for (const solicitud of dataResponse) {
            const rutUsuario = solicitud.rut;
            const urlUsuarioServidor = `${global.BACKEND_URL}/usuarioServidor/${rutUsuario}`;
            const respuestaUsuarioServidor = await fetch(urlUsuarioServidor, {
              method: 'GET',
            });
            const dataUsuarioServidor = await respuestaUsuarioServidor.json();
            solicitudes.push(dataUsuarioServidor);
          }
          this.solicitudes = solicitudes;

        } else {
          this.solicitudes = [];
        }
      } catch (error) {
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
        this.aceptarSolicitud(rut);
      } else if (title === 'rechazar') {
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
        const url = `${global.BACKEND_URL}/agrupaciones/${this.groupId}`; // quite el rut porque no se llamaba y tiraba error
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
          this.VerGrupos();
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }

    },

    async SolicitarAcreditaciondeGrupo() {
      try {
        const url = `${global.BACKEND_URL}/solicitaracreditacion/${this.groupId}/${this.rut}`;
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
    startHoldAbandonar() {
      this.pressTime = 0;
      this.progress = 0;
      this.pressTimer = setInterval(() => {
        this.pressTime += 10;
        this.progress = (this.pressTime / 2000) * 100;
        if (this.pressTime >= 2000) {
          console.log("Eliminando miembro");
          this.EliminarMiembro(this.rut);
          this.cancelHold();
        }
      }, 10);
    },

    cancelHold() {
      clearInterval(this.pressTimer);
      this.progress = 0;
    },
    EliminarGrupo() {
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

  },
  mounted() {
    this.rut = this.getRut();
    this.rolA = this.esMiembro();
    this.lider = this.ObtenerLider();
    this.rol = this.getRol();
    this.adminOlider = this.esAdminOLider();
    this.VerGrupos();
    this.VerActividades();
    this.ObtenerUsuariosDeAgrupacion();
  },
  computed: {
    progressStyle() {
      return {
        background: `linear-gradient(to right, red ${this.progress}%, white ${this.progress}%)`
      };
    },
    itemsFiltroRol() {
      return this.itemsSegunRol.filter(itemsSegunRol => itemsSegunRol.roles.includes(this.rolEnAgrupacion) && itemsSegunRol.title !== 'Abandonar Agrupación');
    },
    abandonarItem() {
      return this.itemsSegunRol.find(itemsSegunRol => itemsSegunRol.roles.includes(this.rolEnAgrupacion) && itemsSegunRol.title === 'Abandonar Agrupación');
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
  text-align: center;
}

.botoneliminar {
  position: relative;
  overflow: hidden;
}

.publicadoen {
  font-size: 10px;
  color: #3f3f3f;
  margin-left: 0px;
  margin-top: -10px;
  margin-bottom: -10px;
}
</style>