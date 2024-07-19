<template>
<v-container cols="12"></v-container>
<v-container cols="12">
  <v-card class="mx-auto px-6 py-8" max-width="800">
    <v-form @submit.prevent="CreaAgrupacion(nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion)" fast-fail class="form" ref="formulario">
      <v-row>
                <v-spacer></v-spacer>
                <v-col cols="12" justify="center">
                    <h1 class="texto">Crear agrupación</h1>
                    <p class="text-left">Por favor, introducir abajo los datos correspondientes a crear una branch.</p>
                </v-col>
                <v-col cols="4">
                    <v-text-field class="nombreAgrupa" v-model="nombre_agr" label="Nombre de la agrupación"
                        clearable counter required></v-text-field>
                </v-col>
                <v-col cols="8">
                    <v-text-field class="descripcion" v-model="descripcion" label="Descripción de la agrupación"
                        clearable counter required></v-text-field>
                </v-col>

                <v-col cols="6" md="6">
                    <v-text-field v-model="fecha_creacion" label="Fecha de creación" type="date" required :min="hoy"
                        :rules="dateRules" :error-messages="dateErrors.creacion" @change="validateFechaCreacion"></v-text-field>
                </v-col>
                <v-col cols="6" md="6">
                    <v-text-field v-model="fecha_verificacion" label="Fecha de verificación" type="date" required :min="hoy"
                        :rules="dateRules" :error-messages="dateErrors.verificacion" @change="validateFechaVerificacion"></v-text-field>
                </v-col>

                <v-col cols="9">
                    <v-text-field v-model="rut" label="RUT"
                    clearable counter required></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-checkbox label="Verificado" v-model="verificado"></v-checkbox>
                </v-col>

                <v-col cols="3">
                  <v-btn class="form-submit" type="submit"
                  color="#2CA2DC">Crear Agrupación</v-btn>
                </v-col>

            </v-row>
            
    </v-form>
  </v-card>
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

    dateErrors: {
      creacion: [],
      verificacion: [],
    },
    
    dateRules: [
            value => {
                if (value) return true
                return 'La fecha es requerida.'
            },
    ],
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
}

</script>
