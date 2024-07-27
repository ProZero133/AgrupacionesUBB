<template>
    <v-container cols="12"></v-container>
    <v-container cols="12">
      <v-card class="mx-auto px-6 py-8" max-width="800">
        <v-form @submit.prevent="CreaAgrupacion" fast-fail class="form" ref="formulario">
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" justify="center">
              <h1 class="texto">Crear agrupación</h1>
              <p class="text-left">Por favor, introducir abajo los datos correspondientes a crear una branch.</p>
            </v-col>
            <v-col cols="4">
              <v-text-field class="nombreAgrupa" v-model="nombre_agr" label="Nombre de la agrupación" clearable counter required></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-text-field class="descripcion" v-model="descripcion" label="Descripción de la agrupación" clearable counter required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox v-model="tags" :items="tagOptions" label="Tags" multiple clearable chips></v-combobox>
            </v-col>
            <v-col cols="6" md="6">
              <v-text-field v-model="fecha_creacion" label="Fecha de creación" type="date" required :rules="dateRules" :error-messages="dateErrors.creacion" @change="validateFechaCreacion"></v-text-field>
            </v-col>
            <v-col cols="9">
              <v-text-field v-model="rut" label="RUT" clearable counter required></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-btn class="form-submit" type="submit" color="#2CA2DC">Crear Agrupación</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'CrearAgrupacion',
    data: () => ({
      nombre_agr: '',
      descripcion: '',
      rut: '',
      fecha_creacion: '',
      verificado: 'Noverificado',
      fecha_verificacion: null,
      tags: [],
      tagOptions: [], // Aquí cargarás los tags existentes desde el backend
      dateErrors: {
        creacion: [],
        verificacion: [],
      },
      dateRules: [
        value => {
          if (value) return true;
          return 'La fecha es requerida.';
        },
        value => {
          const today = new Date();
          const selectedDate = new Date(value);
          today.setHours(0, 0, 0, 0); // Remove time part
          selectedDate.setHours(0, 0, 0, 0); // Consistent with today's time removal
          if (selectedDate >= today) return true;
          return 'La fecha no puede ser antes de hoy.';
        },
      ],
    }),
    created() {
      this.loadTags();
    },
    methods: {
      async loadTags() {
        try {
          const response = await fetch('http://localhost:3000/tags'); // Ajusta la URL según tu endpoint
          if (response.ok) {
            const data = await response.json();
            this.tagOptions = data.map(tag => tag.nombre_tag); // Ajusta según la estructura de tu respuesta
          } else {
            console.error('Error al cargar tags:', response);
          }
        } catch (error) {
          console.error('Error al hacer fetch:', error);
        }
      },
      async CreaAgrupacion() {
        try {
          const { nombre_agr, descripcion, rut, fecha_creacion, verificado, tags } = this;
          const response = await fetch('http://localhost:3000/agrupaciones', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_agr, descripcion, rut, fecha_creacion, verificado, tags }),
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log(data);
          } else {
            console.error('Error en la respuesta:', response);
          }
        } catch (error) {
          console.error('Error al hacer fetch:', error);
        }
      },
      validateFechaCreacion() {
        this.validateDate(this.fecha_creacion, this.dateErrors.creacion);
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
  