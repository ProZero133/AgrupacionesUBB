<template>

    <v-container cols="12"></v-container>
    <v-container cols="12">
      <v-card class="mx-auto px-6 py-8" max-width="800">
        <v-form @submit.prevent="CreaActividad(nom_act, descripcion, imagen, tipo, id_agr)" fast-fail class="form" ref="formulario">
          <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="12" justify="center">
                        <h1 class="texto">Crear actividad</h1>
                        <p class="text-left">Por favor, introducir abajo los datos correspondientes a la actividad a crear.</p>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field class="nombreAct" v-model="nom_act" label="Nombre de la actividad"
                            clearable counter required></v-text-field>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field class="descripcionAct" v-model="descripcion" label="Descripción de la actividad"
                            clearable counter required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="imagen" label="Imagen de la actividad"
                        clearable counter required></v-text-field>
                    </v-col>

                    <v-col cols="4">
                          <v-combobox v-model="tipo"
                          label="Tipo"
                          :items="['Público', 'Privado']"
                        ></v-combobox>
                    </v-col>
    
                    <v-col cols="4">
                        <v-text-field class="idAct" v-model="id_agr" label="ID de la agrupación"
                            clearable counter required></v-text-field>
                    </v-col>
    
                    <v-col cols="4">
                      <v-btn class="form-submit" type="submit"
                      color="#2CA2DC">Crear actividad</v-btn>
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
        nom_act: '',
        descripcion: '',
        imagen: '',
        tipo: '',
        id_agr: '',
      }),
      methods: {
        async CreaActividad(nom_act, descripcion, imagen, tipo, id_agr) {
          console.log(nom_act, descripcion, imagen, tipo, id_agr);
          const today = new Date();
          try {
            // Realiza una solicitud fetch a tu backend Fastify
            const response = await fetch(`${global.BACKEND_URL}/actividad`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nom_act, descripcion, imagen, tipo, id_agr, fecha_creacion: today }),
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
    