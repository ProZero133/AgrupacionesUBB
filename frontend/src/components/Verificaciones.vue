<template>
  <div>
    <v-card class="v-card-custom">
      <v-card-title>
        Agrupaciones Pendientes
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="AgrupacionesPendientesObtenidas">
          <template v-slot:item.action="{ AgrupacionesPendientesObtenidas }">
            <div class="d-flex justify-end">
              <v-btn color="green" name="B_Aceptar" class="B_Aceptar">
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
  </div>
</template>

<script>
export default {
  name: 'CrearAgrupacion',
  data() {
    return {
      AgrupacionesPendientesObtenidas: [],

      // Falta añadir una columna en la que se muestre el numero total de integrantes de la agrupacion

      headers: [
        { text: 'Nombre', value: 'nombre_agr' },
        { text: 'RUT', value: 'rut' },
        { text: 'Acciones', value: 'action', sortable: false },
      ],
    };
  },
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
  },
  mounted() {
    this.ObtenerAgrupacionesPendientes();
  },
};
</script>

<style scoped>

.B_Aceptar, .B_Rechazar {
  margin: 5px;
  min-width: 20%;
}

.v-card-custom {
  margin: 100px;
  margin-left: 10%;
  margin-right: 10%;
}
</style>
