<template>
  <div>
    <v-card class="v-card-custom">
      <v-card-title>
        Administrar roles de Agrupacion
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="UsuariosDeAgrupacion">
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-end">
              <v-select class="SeleccionarRol" v-model="item.rol_agr" label="Seleccionar rol" density="comfortable"
                :items="['Lider', 'Miembro Oficial', 'Miembro']" solo filled 
                @change="ActualizarRolAgrupacion(item.id_usr, item.rol_agr)"></v-select>
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


import { useRoute } from 'vue-router';
  
export default {
  name: 'AdministrarRolesAgrupaciones',
  
  setup() {
    const route = useRoute();
    const groupId = route.params.id;

    return {
      groupId,
    };
  },

  data() {
    return {
      UsuariosDeAgrupacion: [],
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      snackbarTimeout: 3000,
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Rol Agrupación', value: 'action', sortable: false },
      ],
    };
  },

  methods: {
    async ObtenerUsuariosDeAgrupacion() {
      try {
        const url = `http://localhost:3000/administracionderoles/${this.groupId}`;
        const response = await fetch(url , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response);

        if (response.ok) {
          const data = await response.json();
          this.UsuariosDeAgrupacion = data;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async ActualizarRolAgrupacion(rut, id_agr) {
      try {
        const response = await fetch('http://localhost:3000/administracionderoles/34/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rut,
            id_agr,
          }),
        });
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
  },

  mounted() {
    this.ObtenerUsuariosDeAgrupacion();
  },
};
</script>

<style scoped>
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

.SeleccionarRol {
  margin-top: 10px;
  width: 120px;
}

</style>
