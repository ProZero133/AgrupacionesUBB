<template>
  <div>
    <v-card class="v-card-custom">
      <v-card-title>
        Agrupaciones Pendientes
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
  </div>
</template>

<script>
export default {
  name: 'CrearAgrupacion',
  data() {
    return {
      AgrupacionesPendientesObtenidas: [],
      headers: [
        { text: 'Nombre', value: 'nombre_agr' },
        { text: 'RUT', value: 'rut' },
        { text: 'Fecha de Creación', value: 'fecha_creacion' },
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

    async AceptarAgrupacion(id_agr) {
      try {
        // obtiene la agrupacion a la que le clickearon en aceptar
        const Agrupacion_a_Aceptar = this.AgrupacionesPendientesObtenidas.find(agrupacion => agrupacion.id_agr === id_agr);
        console.log("Agrupacion_a_Aceptar");

        const response = await fetch(`http://localhost:3000/acreditaciones/${Agrupacion_a_Aceptar.id_agr}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        });

        if (response.ok) {
          const updatedItem = await response.json();
          this.AgrupacionesPendientesObtenidas = this.AgrupacionesPendientesObtenidas.map(agrupacion =>
            agrupacion.id_agr === updatedItem.id_agr ? updatedItem : agrupacion
          );
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async RechazarAgrupacion() {
      // Falta implementar
    },
  },
  mounted() {
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
</style>
