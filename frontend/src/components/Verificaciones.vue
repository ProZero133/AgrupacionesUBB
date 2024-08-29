<template>
  <v-toolbar color="primary">
    <template v-slot:extension>
      <v-tabs v-model="tab" grow>

        <v-tab prepend-icon="mdi-account-group" value="agrupaciones">
          Agrupaciones
          <v-badge color="red" :content="AgrupacionesPendientesObtenidas.length" inline></v-badge>
        </v-tab>
        <v-tab prepend-icon="mdi-account-multiple" value="actividadesPendientes">
          Actividades
          <v-badge color="red" :content="ActividadesPendientesObtenidas.length" inline></v-badge>
        </v-tab>
      </v-tabs>
    </template>
  </v-toolbar>

  <v-tab-item value="agrupaciones" v-if="tab === 'agrupaciones'">

    <v-card class="v-card-custom">
      <v-card-title>
        Agrupaciones Pendientes
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="AgrupacionPendiente" :items="AgrupacionesPendientesObtenidas" item-value="id_agr">
          <template v-slot:item.fecha_creacion="{ item }">
            {{ formatDate(item.fecha_creacion) }}
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-end">
              <v-btn icon color="blue" name="B_Aceptar" class="B_Aceptar" @click="AceptarAgrupacion(item.id_agr)">
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </v-btn>
              <v-btn icon color="red" name="B_Rechazar" class="B_Rechazar" @click="openRechazarDialog(item.id_agr)">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>


    <v-dialog v-model="rechazarDialog" max-width="500">
      <v-card>
        <v-card-title>
          Indique el motivo:
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="motivoRechazo" label="Escriba aquí su motivo" style="margin: 0%"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" @click="RechazarAgrupacion(selectedId, motivoRechazo)">
            Enviar
          </v-btn>
          <v-btn color="red" @click="rechazarDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor" class="snackbar-custom">
      <span class="snackbar-text">{{ snackbarText }}</span>
    </v-snackbar>

  </v-tab-item>

  <v-tab-item value="actividadesPendientes" v-if="tab === 'actividadesPendientes'">
    <v-card class="v-card-custom">
      <v-card-title>
        Actividades Pendientes
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="ActividadPendiente" :items="ActividadesPendientesObtenidas" item-value="id_act">
          <template v-slot:item.fecha_creacion="{ item }">
            {{ formatDate(item.fecha_creacion) }}
          </template>
          <template v-slot:item.fecha_actividad="{ item }">
            {{ formatDate(item.fecha_actividad) }}
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-end">
              <v-btn icon color="blue" name="B_Aceptar" class="B_Aceptar_Actividad"
                @click="AceptarActividad(item.id_act)">
                <v-icon>mdi-calendar-check</v-icon>
              </v-btn>
              <v-btn icon color="red" name="B_Rechazar" class="B_Rechazar_Actividad"
                @click="openRechazarDialog(item.id_act)">
                <v-icon>mdi-calendar-remove</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-tab-item>
</template>



<script>
export default {
  name: 'CrearAgrupacion',
  data() {
    return {
      tab: 'agrupaciones',
      AgrupacionesPendientesObtenidas: [],
      ActividadesPendientesObtenidas: [],
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      snackbarTimeout: 3000,
      motivoRechazo: '',
      rechazarDialog: false,
      selectedId: null,
      AgrupacionPendiente: [
        { title: 'Nombre Agrupacion', value: 'nombre_agr', sortable: true },
        { title: 'Cantidad de Integrantes', value: 'integrantes', sortable: true },
        { title: 'Líder de Agrupacion', value: 'nombre', sortable: true },
        { title: 'RUT líder', value: 'rut', sortable: true },
        { title: 'Correo líder', value: 'correo', sortable: true },
        { title: 'Fecha de Creación', value: 'fecha_creacion', sortable: true },
        { value: 'action', sortable: false },
      ],

      ActividadPendiente: [
        { title: 'Nombre de Agrupacion', value: 'nombre_agr', sortable: true },
        { title: 'Nombre de Actividad', value: 'nom_act', sortable: true },
        { title: 'Fecha de Creación', value: 'fecha_creacion', sortable: true },
        { title: 'Fecha de Actividad', value: 'fecha_actividad', sortable: true },
        { title: 'Cupos Totales', value: 'cupos', sortable: true },
        { value: 'action', sortable: false },
      ]

    };
  },
  methods: {

    getRut() {
      const token = this.$cookies.get('token');
      if (token) {
        try {
          const tokenParts = token.split('&');
          tokenParts[2] = tokenParts[2].replace('rut=', '');
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
    async ObtenerAgrupacionesPendientes() {
      try {
      const response = await fetch(`${global.BACKEND_URL}/acreditaciones`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        this.AgrupacionesPendientesObtenidas = data;
        await this.ObtenerIntegrantesAgrupaciones(); // Call the method to fetch the number of users for each group
      } else {
        console.error('Error en la respuesta:', response.status);
      }

      } catch (error) {
      console.error('Error al hacer fetch:', error);
      }
    },

    async ObtenerIntegrantesAgrupaciones() {
      try {
      for (const agrupacion of this.AgrupacionesPendientesObtenidas) {
        const response = await fetch(`${global.BACKEND_URL}/administracionderoles/${agrupacion.id_agr}`, {
        method: 'GET',
        });
        if (response.ok) {
        const data = await response.json();
        agrupacion.integrantes = data.length; 
        } else {
        console.error('Error en la respuesta:', response.status);
        }
      }
      } catch (error) {
      console.error('Error al hacer fetch:', error);
      }
    },

    async ObtenerActividadesPendientes() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/ActAgr`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          this.ActividadesPendientesObtenidas = data.filter(item => item.tipo === true && item.aprobado === false);

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async AceptarAgrupacion(id_agr) {
      try {
        const Agrupacion_a_Aceptar = this.AgrupacionesPendientesObtenidas.find(agrupacion => agrupacion.id_agr === id_agr);
        const response = await fetch(`${global.BACKEND_URL}/aceptacionAcr/${Agrupacion_a_Aceptar.id_agr}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verificado: 'Verificado',
          }),
        });

        if (response.ok) {
          this.showSnackbar('Agrupación aceptada con éxito', 'Se le notificará al lider por correo.');
          this.ObtenerAgrupacionesPendientes();
        } else {
          console.error('Error en la respuesta:', response.status);
          this.showSnackbar('Error al aceptar la agrupación', 'error');
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
        this.showSnackbar('Error al aceptar la agrupación', 'error');
      }
    },
    openRechazarDialog(id_agr) {
      this.selectedId = id_agr;
      this.motivoRechazo = '';
      this.rechazarDialog = true;
    },
    async RechazarAgrupacion(id_agr, motivo) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/rechazoAcr/${id_agr}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verificado: 'Noverificado',
            motivo: motivo,
          }),
        });

        if (response.ok) {
          this.showSnackbar('Agrupación rechazada con éxito', 'Se le notificará al lider por correo.');
          this.ObtenerAgrupacionesPendientes();
          this.rechazarDialog = false; // Cerrar el diálogo después de rechazar
        } else {
          console.error('Error en la respuesta:', response.status);
          this.showSnackbar('Error al rechazar la agrupación', 'error');
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
        this.showSnackbar('Error al rechazar la agrupación', 'error');
      }
    },

    async AceptarActividad(id_act) {
      try {
        const Actividad_a_Aceptar = this.ActividadesPendientesObtenidas.find(actividad => actividad.id_act === id_act);
        const response = await fetch(`${global.BACKEND_URL}/aceptacionAct/${Actividad_a_Aceptar.id_act}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Aprobado: true,
          }),
        });

        if (response.ok) {
          this.showSnackbar('Actividad aceptada con éxito', 'Se le notificará al lider por correo.');
          this.ObtenerActividadesPendientes();
        } else {
          console.error('Error en la respuesta:', response.status);
          this.showSnackbar('Error al aceptar la actividad', 'error');
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
        this.showSnackbar('Error al aceptar la actividad', 'error');
      }
    },

    showSnackbar(message, color) {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    formatDate(dateString) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    }
  },
  mounted() {
    this.getRut();
    this.getRol();
    this.ObtenerAgrupacionesPendientes();
    this.ObtenerActividadesPendientes();
  },

};
</script>

<style scoped>
.B_Aceptar,
.B_Rechazar {
  margin: 2px;
  min-width: 20px;
}

.v-card-custom {
  margin: 5%;
  margin-left: 5%;
  margin-right: 5%;
}

.snackbar-custom {
  display: flex;
  justify-content: center;
  align-items: center;
}

.snackbar-text {
  text-align: center;
  width: 100%;
}
</style>
