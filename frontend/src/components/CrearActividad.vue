<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-card class="mx-auto px-6 py-8" max-width="800">
      <v-form @submit.prevent="CreaActividad(nom_act, descripcion, imagen, tipo, id_agr)" fast-fail class="form" ref="formulario">
        <v-row>
          <v-spacer></v-spacer>
            <v-col cols="12" justify="center" class="title-card">
              <h1 class="texto">Crear actividad</h1>
              <p class="text-left">Por favor, introducir abajo los datos correspondientes a la actividad a crear.</p>
            </v-col>
            
            <v-col cols="12" md="7">

              <v-col cols="12">
                  <v-text-field class="nombreAct" v-model="nom_act" label="Nombre de la actividad"
                  clearable required variant="solo-filled"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  class="descripcionAct"
                  v-model="descripcion"
                  label="Descripción de la actividad"
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
                  label="Imagen para la actividad"
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

              <v-col cols="12" class="bottomElement">

                <v-checkbox v-model="tipo">
                  <template v-slot:label>
                    <div>
                      <h2 v-if=tipo>Actividad Pública: Activado</h2>
                      <h2 v-else>Actividad Pública: Desactivado</h2>
                      <h4 v-if=tipo>Todos podrán ver y participar en la actividad, sean miembros del grupo o no.</h4>
                      <h4 v-else>Sólo los miembros del grupo podrán ver y participar de la actividad.</h4>
                    </div>
                  </template>
                </v-checkbox>

              </v-col>

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
                color="#2CA2DC">Crear actividad</v-btn>
              </v-col>

            </v-col>
              
              </v-row>
              
      </v-form>
    </v-card>
  </v-container>
  </template>
  
<script>
import addImage from '../assets/imagePlaceholder.png';
  
  export default {
    name: 'HelloWorld',
  
    data: () => ({
      nom_act: '',
      descripcion: '',
      imagen: '',
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
        const patata = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG7Hfjekh-OCFx5U1rmOYk76Bq-Kt9C3_4Pw&s";
        
        console.log(nom_act, descripcion, patata, tipo, id_agr);
        try {
          // Realiza una solicitud fetch a tu backend Fastify
          const response = await fetch('http://localhost:3000/actividades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom_act, descripcion, patata, tipo, id_agr }),
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
  .descripcionAct {
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