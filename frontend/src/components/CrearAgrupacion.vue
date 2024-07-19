<template>
  <div>
    <v-card class="v-card-custom">
      <v-card-title>
        Agrupaciones Pendientes
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="groups">
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
      groupName: '',
      groupDescription: '',
      groupType: null,
      groupTypes: ['Académico', 'Cultural', 'Deportivo'],
      headers: [
        { text: 'Nombre del Grupo', value: 'name' },
        { text: 'Acción', value: 'action', sortable: false },
      ],
      groups: [
        { name: 'UBB' },
        { name: 'SIM UBB' },
        { name: 'Futbol UBB' },
        { name: 'E-sports UBB' },
        { name: 'Debate' },
      ],
    };
  },
  methods: {
    submitForm() {
      // Lógica para enviar la solicitud de oficialización
      console.log('Solicitud enviada:', this.groupName, this.groupDescription, this.groupType);
    },
    validateFechaCreacion() {
      this.validateDate(this.fecha_creacion, this.dateErrors.creacion);
    },
    validateFechaVerificacion() {
      this.validateDate(this.fecha_verificacion, this.dateErrors.verificacion);
    },
    validateDate(fecha, errors) {
      errors = [];
      for (let rule of this.dateRules) {
        let result = rule(fecha);
        if (typeof result === 'string') {
          this.dateErrors.push(result);
        }
      }
    },
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
