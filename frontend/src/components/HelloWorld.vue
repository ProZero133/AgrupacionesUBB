<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif"
          class="my-3" contain height="500" />
      </v-col>
      <v-btn variant="tonal" @click="SaludoBackend">
        Saludo Backend
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'HelloWorld',

  data: () => ({
  }),
  methods: {
    async SaludoBackend() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch('http://localhost:3000/usuarios', {
          method: 'GET',
          // Puedes agregar más configuraciones a la solicitud aquí si es necesario
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();

          // Haz algo con los datos recibidos
          console.log(data);
          // Puedes guardar los datos en el estado de tu componente o realizar otras acciones
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async ObtenAgrupaciones() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch('http://localhost:3000/agrupaciones', {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async login() {
      const response = await fetch('http://localhost:3000/EmailLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email }),
      });
    },
    async ObtenAgrupaciones() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch('http://localhost:3000/agrupaciones', {
          method: 'GET',
          // Puedes agregar más configuraciones a la solicitud aquí si es necesario
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();

          // Haz algo con los datos recibidos
          console.log(data);
          // Puedes guardar los datos en el estado de tu componente o realizar otras acciones
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async CreaAgrupacion(nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion) {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        console.log(nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion);

        const response = await fetch('http://localhost:3000/agrupacion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion }),
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async CreaActividad(nom_act, descripcion, imagen, tipo, id_agr) {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch('http://localhost:3000/actividad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nom_act, descripcion, imagen, tipo, id_agr }),
        });
        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    }
  },
}

</script>
