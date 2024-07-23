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
              <v-btn color="primary" name="Botones">
                Solicitud Pendiente
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
        { text: 'Descripción', value: 'descripcion' },
        { text: 'RUT', value: 'rut' },
        { text: 'Verificado', value: 'verificado' },
        { text: 'Fecha de verificación', value: 'fecha_verificacion' },
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
.v-card-custom {
  margin: 100px;
  margin-left: 300px;
  margin-right: 300px;
}
</style>
