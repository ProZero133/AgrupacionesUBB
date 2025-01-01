<template>

  <v-container cols="12">
  </v-container>
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

            <v-data-table :headers="headersMiembros" :items="MiembrosdeAgr" :sort-by="['user_nombre']"
              :sort-desc="[false]">
              <template v-slot:item.action="{ item }">

                <div class="d-flex justify-end">

                  <!-- Dialog editar -->

                  <v-dialog width="auto" scrollable>
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn color="brown" prepend-icon="mdi-pencil" variant="outlined" v-bind="activatorProps"
                        @click="ObtenerRolUsr(item.rut)"></v-btn>
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
                label="Imagen de la agrupación" clearable required variant="solo-filled" prepend-icon=""
                @change="onFileChange($event)" @click:clear="urlImagen = defaultImageUrl" disabled>
              </v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-card class="search-container pa-3 mb-3">
              <v-card-title class="pa-0">Añadir Tags a las preferencias</v-card-title>
              <v-text-field v-model="searchQuery" @input="fetchSearchResults(searchQuery)" append-icon="mdi-magnify"
                label="Buscar..." single-line hide-details></v-text-field>
              <v-card-text class="pa-0">
                <v-chip-group>
                  <v-chip v-for="item in searchResults" :key="item.id" @click="selectItem(item)" class="result-item"
                    color="primary" text-color="white" outlined>
                    {{ item.nombre_tag }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-row>
          <v-row>
            <v-card-text class="pa-0">
              <v-chip-group>
                <v-chip v-for="tag in preferencias" :key="tag.id_tag" @click="eliminarTag(tag)" class="selected-item"
                  color="primary" text-color="white" outlined>
                  {{ tag.nombre_tag }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
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
        <v-card-title class="headline">
          <v-row align="center" justify="space-between" style="width: 100%;">
            <v-col cols="auto">
              {{ elemento.nombre }}
            </v-col>
            <v-col cols="auto" v-if="permisoEliminar">
              <v-btn icon @click="eliminarElemento(elemento)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
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
              <v-btn color="green darken-1" text @click="dialogPub = false">Cerrar</v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn v-if="this.rol!='Admin'" :disabled="elemento.participantes >= elemento.cupos"
                :color="elemento.participantes >= elemento.cupos ? 'red' : 'green'" text
                @click="ParticiparActividad(elemento.id)">Participar</v-btn>
              <v-icon :color="elemento.participantes >= elemento.cupos ? 'red' : 'green'" class="ml-2">
                mdi-account-circle-outline
              </v-icon>
              <span>{{ elemento.participantes }} / {{ elemento.cupos }}</span>
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Botón de Crear Actividad o Publicación -->
  <VLayoutItem v-if="rolA" model-value position="bottom" class="text-end pointer-events-none" size="120">
    <div class="ma-9 pointer-events-initial">
      <v-menu v-if="rol !== 'Admin'">
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
          <v-list-item v-for="(item, index) in modItems" :key="index"
            :disabled="item.title === 'Solicitar Acreditación' && (datosGrupo.verificado === 'Pendiente' || datosGrupo.verificado === 'Verificado')"
            v-on:click="modalMaker(item.path)">
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
            v-on:click="this.$router.push(item.path + `${groupId}`)" disabled>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </VLayoutItem>
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
</template>

<script>
import addImage from '../assets/placeholder.png';
import { useRoute } from 'vue-router';
import { mergeProps } from 'vue';
import { da, fa, fi, ro } from 'vuetify/lib/locale/index.mjs';
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
    permisoEliminar: false,

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
    preferencias: [],
    preferenciasActuales: [],
    searchResults: [],
    selectedItems: [],
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    snackbarTimeout: 3000,
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
      { title: 'Nombre', value: 'nombres', sortable: true },
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
      { title: 'Ver Miembros', path: 'dialogmiembros', tier: 1, disabled: false },
      { title: 'Editar Grupo', path: 'dialogeditar', tier: 0, disabled: false },
      { title: 'Solicitar Acreditación', path: 'dialogsolicitar', tier: 0, disabled: false },
      { title: 'Eliminar Agrupación', path: 'dialogeliminar', tier: 1, disabled: false },
      { title: 'Invitar Usuarios', path: 'dialoginvitar', tier: 1, disabled: false },
    ],

    aparienciaItems: [
      { title: 'Cambiar Fondo', roles: ['Lider'] },
      { title: 'Cambiar Fondo descripción', roles: ['Lider'] },
      { title: 'Cambiar Bordes actividades', roles: ['Lider'] },
    ],

    rolesPermitidosEliminar: ['Lider', 'Administrador'],

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
        const response = await fetch(`${global.BACKEND_URL}/participar/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        const data = await response.json();
        if (data.ok) {
          this.dialogPub = false;
          this.$root.showSnackBar('success', 'Te has unido a una actividad', 'Operacion exitosa');
        } else {
          console.error(data.message);
          console.error('Error en la respuesta:', response.status);
          this.$root.showSnackBar('error', data.message, 'Error de carga de datos');
          this.dialogPub = false;
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
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({ mail: this.mailInvitado, id_agr: this.datosGrupo.id_agr, nombre_agr: this.datosGrupo.nombre_agr }),
        });
        const data = await response.json();
        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          this.$root.showSnackBar('success', data.message, 'Operación exitosa');
          this.dialoginvitar = false;
        } else {
          this.dialoginvitar = false;
          this.$root.showSnackBar('error', data.message, 'Error de carga de datos');
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
        const url = `${global.BACKEND_URL}/obtenerUsuariosAgrupacion/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filtrada = data.filter((item) => item.rol_agr !== 'Pendiente' & item.rut !== "11.111.111-1");
          this.MiembrosdeAgr = filtrada; 


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
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
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
        if (this.rol === 'Admin') {
          return;
        } else {
          this.$root.showSnackBar('error', 'Seguro que eres parte de este grupo?', 'Error de carga de datos');
          console.error('Error al obtener el rol:', error);
        }

      }
    },


    async ObtenerLider() {
      const rutLider = this.getRut();
      try {
        const url = `${global.BACKEND_URL}/LiderArray/${this.groupId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        if (response.ok) {
          const datosLiderAgrupacion = await response.json();

          if (datosLiderAgrupacion[0].rut === rutLider) {
            this.lider = true;
          } else {
            this.lider = false;
          }
          return datosLiderAgrupacion;

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
      console.log("rut, ", rut);
      try {
        const url = `${global.BACKEND_URL}/obtencionderoles/${this.groupId}/${rut}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        const data = await response.json();
        console.log("data, ", data);
        if (response.ok) {
          const datosUsuarioSeleccionado = await response.json();
          this.selectedRole = datosUsuarioSeleccionado.rol_agr;

          return datosUsuarioSeleccionado;

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },


    async CambiarRolAgrupacion(rut, rol_agr) {
      try {
        // Si el rol_agr es 'Lider', debe cambiar el rol del usuario actual a 'Miembro'
        const datosLiderAgrupacion = await this.ObtenerLider();
        const datosUsuarioSeleccionado = await this.ObtenerRolUsr(rut);

        if (rol_agr === 'Lider') {

          if (datosLiderAgrupacion.rut != datosUsuarioSeleccionado.rut) {
            const cambiarLider = `${global.BACKEND_URL}/administracionderoles/${this.groupId}/${datosLiderAgrupacion[0].rut}`;
            const responseNuevoLider = await fetch(cambiarLider, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
              },
              body: JSON.stringify({
                rol_agr: "Miembro"
              }),
            });
          }
          const url = `${global.BACKEND_URL}/administracionderoles/${this.groupId}/${rut}`;
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
            body: JSON.stringify({
              rol_agr
            }),
          });
          if (response.ok) {
            this.$root.showSnackBar('success', 'Rol actualizado correctamente', 'Operación exitosa');
          } else {
            console.error('Error en la respuesta:', response.status);
            this.$root.showSnackBar('error', 'Error al actualizar el rol', 'Operación fallida');
          }
        }

        if (rol_agr === 'Miembro Oficial' || rol_agr === 'Miembro') {
          if (datosLiderAgrupacion.length != 1) {
            console.error('Una agrupacion no puede quedar sin Lider');
            this.$root.showSnackBar('error', 'Una agrupacion no puede quedar sin Lider', 'Operación fallida');
            return;
          }
          const url = `${global.BACKEND_URL}/administracionderoles/${this.groupId}/${rut}`;
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
            body: JSON.stringify({
              rol_agr
            }),
          });
          if (response.ok) {
            this.$root.showSnackBar('success', 'Rol actualizado correctamente', 'Operación exitosa');
          } else {
            console.error('Error en la respuesta:', response.status);
            this.$root.showSnackBar('error', 'Error al actualizar el rol', 'Operación fallida');
          }
        }


        this.dialogmiembros = false;
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        this.ObtenerUsuariosDeAgrupacion();
        if (response.ok) {
          this.$root.showSnackBar('success', 'Usuario eliminado correctamente', 'Operación exitosa');
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          this.datosGrupo = data;

          try {
            const responde = await fetch(`${global.BACKEND_URL}/imagen/` + this.datosGrupo.imagen, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
              },
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
    async anadirAElementos(array) {
      for (const element of array) {
        if (element.tipo_elemento === 'actividad') {
          const participantes = await this.CantidadParticipantes(element.id);
          element.participantes = participantes;
        }
        const index = this.findInsertIndex(this.elementos, element);
        this.elementos.splice(index, 0, element);
      }
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
          return data.participantes.length;
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
        const response = await fetch(`${global.BACKEND_URL}/actividadesgrupo/${this.groupId}`, {
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
          } else {
            this.actividades = data;
            for (const actis of this.actividades) {
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
            let elementosAct = this.actividades.map((elemento) => {
              return {
                id: elemento.id_act,
                nombre: elemento.nom_act,
                descripcion: elemento.descripcion,
                tipo: elemento.tipo,
                imagen: elemento.imagen,
                id_agr: elemento.id_agr,
                tipo_elemento: 'actividad',
                fecha_creacion: elemento.fecha_creacion,
                cupos: elemento.cupos
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
                tipo_elemento: publicacion.tipoPub,
                fecha_creacion: publicacion.fecha_publicacion,
              };

              if (publicacion.tipoPub === 'formulario') {
                elemento.hipervinculo = publicacion.hipervinculo;
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        const dataResponse = await response.json();
        if (response.ok || response.status === 404) {
          const solicitudes = [];
          for (const solicitud of dataResponse) {
            const rutUsuario = solicitud.rut;
            const urlUsuarioServidor = `${global.BACKEND_URL}/usuarioServidor/${rutUsuario}`;
            const respuestaUsuarioServidor = await fetch(urlUsuarioServidor, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
              },
            });
            const dataUsuarioServidor = await respuestaUsuarioServidor.json();
            solicitudes.push(dataUsuarioServidor[0]);
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
          headers: {

            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          this.VerSolicitudes();
          this.ObtenerUsuariosDeAgrupacion();
          this.$root.showSnackBar('success', 'Solicitud aceptada correctamente', 'Operación exitosa');
        } else {
          this.$root.showSnackBar('error', 'Error al aceptar la solicitud', 'Operación fallida');
        }
      } catch (error) {
      }
    },
    async rechazarSolicitud(rut) {
      try {
        const url = `${global.BACKEND_URL}/rechazarsolicitud/${rut}/${this.groupId}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {

            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          this.VerSolicitudes();
          this.$root.showSnackBar('success', 'Solicitud rechazada correctamente', 'Operación exitosa');
        } else {
          this.$root.showSnackBar('error', 'Error al rechazar la solicitud', 'Operación fallida');
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
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
        const tagsGrupo = this.selectedItems;
        const url = `${global.BACKEND_URL}/agrupaciones/${this.groupId}`; // quite el rut porque no se llamaba y tiraba error
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({
            nombre_agr: nombre,
            descripcion: descripciongrupo,
            rut: this.rut,
          }),
        });

        // Inserta los tags seleccionados en la agrupación en el body del fetch
        for (const tag of tagsGrupo) {
          const responseTag = await fetch(`${global.BACKEND_URL}/ingresartagsagrupacion`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
            body: JSON.stringify({
              id_agr: this.groupId,
              id_tag: tag.id_tag,
            }),
          });
          if (!responseTag.ok) throw new Error('Error al agregar tag a la agrupación');
        }


        if (response.ok) {
          this.VerGrupos();
          this.snackbarMessage = 'Grupo editado correctamente';
          this.snackbarOperationMessage = 'Operación exitosa';
          this.snackbarColor = 'success';
        } else {
          console.error('Error en la respuesta:', response.status);
          this.snackbarMessage = 'Error al editar el grupo';
          this.snackbarOperationMessage = 'Operación fallida';
          this.snackbarColor = 'error';
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
      finally {
        this.$root.showSnackBar(this.snackbarColor, this.snackbarMessage, this.snackbarOperationMessage);
        this.dialogeditar = false;
      }

    },
    async obtenerTagsGrupo() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/obtenerTagsAgrupacion/${this.groupId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });

        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        this.preferencias = []; // Asegúrate de que preferencias esté vacío antes de asignar nuevos valores
        const tagsPromises = data.map(async (item) => {
          const tagResponse = await fetch(`${global.BACKEND_URL}/obtenerTagPorId/${item.id_tag}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
          });

          if (!tagResponse.ok) throw new Error('Error al obtener tag por ID');
          const tagData = await tagResponse.json();
          return tagData[0]; // Asume que siempre hay al menos un elemento y toma el primero
        });
        const tags = await Promise.all(tagsPromises);
        this.preferencias = tags; // Asigna el resultado a preferencias
        this.preferenciasActuales = tags; // Asigna el resultado a preferenciasActuales

      } catch (error) {
        console.error('Error al obtener preferencias:', error);
      }
    },
    async fetchSearchResults(searchValue) {
      // Convertir searchValue a cadena explícitamente
      const stringValue = searchValue.trim();
      if (stringValue === '') {
        this.searchResults = [];
        return;
      }
      try {
        const response = await fetch(`${global.BACKEND_URL}/buscarTags/${stringValue}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        this.searchResults = data; // Asegúrate de que esto coincida con el formato de tu respuesta
      } catch (error) {
        console.error('Error al buscar:', error);
        this.searchResults = [];
      }
    },

    async SolicitarAcreditaciondeGrupo() {
      try {
        const url = `${global.BACKEND_URL}/solicitaracreditacion/${this.groupId}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          this.snackbarMessage = 'Solicitud enviada correctamente';
          this.snackbarOperationMessage = 'Operación exitosa';
          this.snackbarColor = 'success';
        } else {
          console.error('Error en la respuesta:', response.status);
          this.snackbarMessage = 'Error al enviar la solicitud';
          this.snackbarOperationMessage = 'Operación fallida';
          this.snackbarColor = 'error';
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
        this.snackbarMessage = 'Error al enviar la solicitud';
        this.snackbarOperationMessage = 'Operación fallida';
        this.snackbarColor = 'error';
      }
      finally {
        this.dialogsolicitar = false;
        this.$root.showSnackBar(this.snackbarColor, this.snackbarMessage, this.snackbarOperationMessage);
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
          this.EliminarMiembro(this.rut);
          this.cancelHold();
          this.$root.showSnackBar('success', 'Has abandonado el grupo', 'Operación exitosa');
        }
      }, 10);
    },

    cancelHold() {
      clearInterval(this.pressTimer);
      this.progress = 0;
    },
    EliminarGrupo() {
      try {
        const url = `${global.BACKEND_URL}/eliminaragrupacion/${this.groupId}`;
        const response = fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          this.$root.showSnackBar('success', 'Grupo eliminado correctamente', 'Operación exitosa');
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }

      this.dialogeliminar = false;
      this.$router.push('/api/home');
    },
    async eliminarTag(item) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/eliminarTagAgrupacion/${this.groupId}/${item.id_tag}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        this.obtenerTagsGrupo();
      } catch (error) {
        console.error('Error al eliminar preferencia:', error);
      }
    },
    selectItem(item) {
      this.selectedItems.push(item); // Añade el item a la lista de seleccionados
      this.preferencias.push(item); // Añade el item a `preferencias`
      this.searchResults = this.searchResults.filter(i => i.id !== item.id); // Elimina el item de `searchResults`
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
    async eliminarElemento(elemento) {
      if (elemento.tipo_elemento === 'actividad') {
        try {
          const url = `${global.BACKEND_URL}/actividades/${elemento.id}`;
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
          });
          if (response.ok) {
            this.$root.showSnackBar('success', 'Actividad eliminada correctamente', 'Operación exitosa');
          } else {
            this.$root.showSnackBar('error', 'Error al eliminar la actividad', 'Operación fallida');
            console.error('Error en la respuesta:', response.status);
          }
        } catch (error) {
          console.error('Error al hacer fetch:', error);
        }
      } else {
        if (elemento.tipo_elemento === 'publicacion') {
          try {
            const post = await fetch(`${global.BACKEND_URL}/post/${elemento.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
              },
            });
            if (!post.ok) throw new Error('Error al eliminar la publicación');

            const url = `${global.BACKEND_URL}/publicaciones/${elemento.id}`;
            const responsePublicacion = await fetch(url, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
              },
            });
            if (responsePublicacion.ok) {
              this.$root.showSnackBar('success', 'Publicación eliminada correctamente', 'Operación exitosa');
              this.dialogPub = false;
            } else {
              this.$root.showSnackBar('error', 'Error al eliminar la publicación', 'Operación fallida');
              console.error('Error en la respuesta:', responsePublicacion.status);
            }
          } catch (error) {
            console.error('Error al hacer fetch:', error);
          }
          this.dialogPub = false;
        }
        else {
          const url = `${global.BACKEND_URL}/formulario/${elemento.id}`;
          const responseForm = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
          });
          if (responseForm.ok) {
            this.dialogPub = false;
            this.$root.showSnackBar('success', 'Formulario eliminado correctamente', 'Operación exitosa');
          } else {
            this.$root.showSnackBar('error', 'Error al eliminar el formulario', 'Operación fallida');
            console.error('Error en la respuesta:', responseForm.status);
          }
          const publi = await fetch(`${global.BACKEND_URL}/publicaciones/${elemento.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
          });
        }
      }
      // Cerrar dialog
      this.dialogPub = false;
      window.location.reload();
      await this.VerActividades();
    },

    async puedeEliminarElemento() {
      await this.esMiembro();
      const rolPlataforma = this.rol
      const rolAgrupacion = this.rolEnAgrupacion
      if (rolPlataforma === 'Admin' || rolAgrupacion === 'Lider') {
        this.permisoEliminar = true
      }
      else {
        this.permisoEliminar = false
      }
    }

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
    this.obtenerTagsGrupo();
    this.puedeEliminarElemento()
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

.search-container {
  height: 25vh;
  /* Ajusta el tamaño del contenedor de búsqueda */
  max-height: 400px;
  overflow-y: auto;
}

.selected-items-container {
  /* Ajusta el tamaño del contenedor de items seleccionados */
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  /* Estilos personalizados para los chips de resultados */
  margin: 5px;
}

.selected-item {
  /* Estilos personalizados para los chips de items seleccionados */
  margin: 5px;
}

.snackbar {
  /* Estilos personalizados para el snackbar */
  width: 40vw;
  height: 50vh;
  /* Ajusta snack a la parte superior de la pantalla */
  top: 10vh;
}
</style>