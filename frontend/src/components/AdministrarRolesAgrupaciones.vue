<template>
    <div>
      <v-card class="v-card-custom">
        <v-card-title>
          Gestion de Roles de Agrupaciones
        </v-card-title>
        <v-card-text>
          <v-data-table :headers="headers" :items="AgrupacionesPendientesObtenidas">
            <template v-slot:item.action="{ item }">
              <div class="d-flex justify-end">
                <v-btn color="green" name="B_Aceptar" class="B_Aceptar" @click="AceptarAgrupacion(item.id_agr)">
                  Aceptar
                </v-btn>
                <v-btn color="red" name="B_Rechazar" class="B_Rechazar">
                  Rechazar
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor" class="snackbar-custom">
        <span class="snackbar-text">{{ snackbarText }}</span>
      </v-snackbar>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdministrarRolesAgrupaciones',
    data() {
      return {
        AgrupacionesPendientesObtenidas: [],
        snackbar: false,
        snackbarText: '',
        snackbarColor: '',
        snackbarTimeout: 3000,
        headers: [
          { text: 'Nombre', value: 'nombre_agr' },
          { text: 'RUT', value: 'rut' },
          { text: 'Fecha de Creación', value: 'fecha_creacion' },
          { text: 'Acciones', value: 'action', sortable: false },
        ],
      };
    },
  
  // ------------------------------------------------------------------------------------------
  
    methods: {
      async ObtenerAgrupacionesPendientes() {
        try {
          const response = await fetch('http://localhost:3000/acreditaciones', {
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
      
  // ------------------------------------------------------------------------------------------
  
      async AceptarAgrupacion(id_agr) {
        try {
          // obtiene la agrupacion a la que le clickearon en aceptar
          const Agrupacion_a_Aceptar = this.AgrupacionesPendientesObtenidas.find(agrupacion => agrupacion.id_agr === id_agr);
          console.log("Agrupacion_a_Aceptar", Agrupacion_a_Aceptar);
  
          const response = await fetch(`http://localhost:3000/acreditaciones/${Agrupacion_a_Aceptar.id_agr}`, {
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
  
  // ------------------------------------------------------------------------------------------
  
      async RechazarAgrupacion() {
        // Falta implementar
      },
  
      showSnackbar(message, color) {
        this.snackbarText = message;
        this.snackbarColor = color;
        this.snackbar = true;
      },
    },
  
  // ------------------------------------------------------------------------------------------
    
    mounted() {
      this.ObtenerAgrupacionesPendientes();
    },
  
  // ------------------------------------------------------------------------------------------
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
  