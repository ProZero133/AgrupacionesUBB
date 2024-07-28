<template>
  <div>
    <v-card class="v-card-custom">
      <v-card-title>
        Agrupaciones Pendientes
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="AgrupacionesPendientesObtenidas"
          item-value="id_agr"
        >
          <template v-slot:item.fecha_creacion="{ item }">
            {{ formatDate(item.fecha_creacion) }}
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-end">
              <v-btn color="green" name="B_Aceptar" class="B_Aceptar" @click="AceptarAgrupacion(item.id_agr)">
                Aceptar
              </v-btn>
              <v-btn color="red" name="B_Rechazar" class="B_Rechazar" @click="openRechazarDialog(item.id_agr)">
                Rechazar
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
          <v-textarea
            v-model="motivoRechazo"
            label="Escriba aquí su motivo"
            style="margin: 0%"
          ></v-textarea>
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
  </div>
</template>

<script>
export default {
  name: 'CrearAgrupacion',
  data() {
    return {
      AgrupacionesPendientesObtenidas: [],
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      snackbarTimeout: 3000,
      motivoRechazo: '',
      rechazarDialog: false,
      selectedId: null,
      headers: [
        { text: 'Nombre', value: 'nombre_agr' },
        { text: 'RUT', value: 'rut' },
        { text: 'Fecha de Creación', value: 'fecha_creacion' },
        { text: 'Acciones', value: 'action', sortable: false },
      ],
    };
  },
  methods: {
    getRut() {
      const token = this.$cookies.get('token');
      if (token) {
        try {
          const tokenParts = token.split('&');
          tokenParts[2] = tokenParts[2].replace('rut=', '');
          console.log('Token:', tokenParts[2]);
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
        const response = await fetch(`${global.BACKEND_URL}/acreditaciones/${Agrupacion_a_Aceptar.id_agr}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verificado: 'Verificado',
          }),
        });

        if (response.ok) {
          this.showSnackbar('Agrupación aceptada con éxito', 'success');
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
        const response = await fetch(`${global.BACKEND_URL}/acreditaciones/${id_agr}`, {
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
          this.showSnackbar('Agrupación rechazada con éxito', 'success');
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
  },
};
</script>

<style scoped>
.B_Aceptar,
.B_Rechazar {
  margin: 5px;
  min-width: 20%;
}

.v-card-custom {
  margin: 100px;
  margin-left: 10%;
  margin-right: 10%;
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
