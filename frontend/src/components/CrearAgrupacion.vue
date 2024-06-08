<template>
  <v-container>
    <v-col cols="12">
        <v-img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif"
          class="my-3" contain height="500" />
      </v-col>
    <v-row class="text-center">
      <v-col cols="12">
        <form @submit.prevent="login">
          <input type="email" v-model="email" placeholder="Enter your email" required>
          <button type="submit">Login</button>
        </form>
      </v-col>
      <v-col cols="12">
        <form
          @submit.prevent="CreaAgrupacion(nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion)">
          <input type="text" v-model="nombre_agr" placeholder="Nombre de la agrupación" required>
          <input type="text" v-model="descripcion" placeholder="Descripción" required>
          <input type="text" v-model="rut" placeholder="Rut" required>
          <input type="date" v-model="fecha_creacion" placeholder="Fecha de creación" required>
          <input type="checkbox" v-model="verificado" placeholder="Verificado" required>
          <input type="date" v-model="fecha_verificacion" placeholder="Fecha de verificación" required>
          <button type="submit">Crear agrupación</button>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'HelloWorld',

  data: () => ({
    nombre_agr: '',
    descripcion: '',
    rut: '',
    fecha_creacion: '',
    verificado: false,
    fecha_verificacion: '',
  }),
  methods: {
    async login() {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email }),
      });
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
  },
}

</script>
