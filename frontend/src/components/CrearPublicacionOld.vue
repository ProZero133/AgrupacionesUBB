<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-card class="mx-auto px-6 py-8" max-width="800">
      <v-form @submit.prevent="CreaActividad(nom_act, descripcion, imagen, tipo, id_agr)" fast-fail class="form" ref="formulario">
        <v-row>
          <v-spacer></v-spacer>
            <v-col cols="12" justify="center" class="title-card">
              <h1 class="texto">Crear publicación</h1>
              <p class="text-left">Publica algo al grupo. Introduce abajo los datos sobre tu publicación.</p>
            </v-col>
            
            <v-col cols="12" md="7">

              <v-col cols="12">
                  <v-text-field v-model="nom_act" label="Nombre de la publicación"
                  clearable required variant="solo-filled"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  class="descripcion"
                  v-model="descripcion"
                  label="Descripción de la publicación"
                  clearable required variant="solo-filled"
                  height="200px"
                  >
                </v-text-field>
              </v-col>

            </v-col>

            <v-col cols="12" md="5">
            
              <v-col cols="12">
                <v-file-input
                  v-model="imagen"
                  accept="image/png, image/jpeg, image/bmp"
                  label="Imagen para la publicación"
                  clearable
                  required
                  variant="solo-filled"
                  prepend-icon=""
                  @change="onFileChange($event)"
                  @click:clear="urlImagen = defaultImageUrl"
                  >
                </v-file-input>
              </v-col>

              <v-col>
                <v-img 
                class="image"
                max-height="280px"
                aspect-ratio="1"
                :src='urlImagen' />
              </v-col>

            </v-col>
            


            <v-col cols="12" md="12">

              <v-col cols="12">
                <v-text-field
                  class="idAct"
                  v-model="id_agr"
                  label="ID de la agrupación"
                  clearable counter required>
                </v-text-field>
              </v-col>

              <v-col cols="4">
                <v-btn class="form-submit" type="submit"
                color="#2CA2DC">Crear publicación</v-btn>
              </v-col>

            </v-col>
              
              </v-row>
              
      </v-form>
    </v-card>
  </v-container>
  </template>
  
<script>
import addImage from '../assets/imagePlaceholder.png';
import { useRoute } from 'vue-router';
  
  export default {
    setup() {
    const route = useRoute();
    const groupId = route.params.id;

    return {
      groupId,
    };
    },
  
    data: () => ({
      nom_act: '',
      descripcion: '',
      imagen: [],
      tipo: false,
      id_agr: '',
      defaultImageUrl: addImage,
      urlImagen: addImage,
    }),
    methods: {
      createImage(file) {
        const reader = new FileReader();
      
        // Extract the File object from the Proxy
        const actualFile = file[0];
      
        reader.onload = e => {
          this.urlImagen = e.target.result;
        };
      
        // Ensure the extracted object is a File before calling readAsDataURL
        if (actualFile instanceof File) {
          reader.readAsDataURL(actualFile);
        } else {
          console.error("El archivo presentado no es un archivo.");
        }
      },

      onFileChange() {
        const file = this.imagen;
        if (!file) {
          this.urlImagen = this.defaultImageUrl;
          return;
        }
        this.createImage(file);
      },

      async CreaActividad(nom_act, descripcion, imagen, tipo, id_agr) {
        console.log(imagen);
        
        console.log(nom_act, descripcion, imagen, tipo, id_agr);
        try {
          // Realiza una solicitud fetch a tu backend Fastify
          const response = await fetch(`${global.BACKEND_URL}/actividad`, {
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
      },
    },
  }
  
</script>
<style>
  .descripcion {
    height: 520px !important;
    margin-top: -20px;
    margin-bottom: -260px;
  }
  .image {
    margin-top: -20px;
    margin-bottom: -20px;
  }
  .bottomElement {
    margin-top: -0px;
  }
  .title-card {
    margin-left: 12px;
  } 
</style>