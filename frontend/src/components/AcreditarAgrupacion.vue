<template>
  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-card class="mx-auto px-6 py-8" max-width="800">
      <v-form @submit.prevent="CreaActividad(nom_act, descripcion, imagen, tipo, id_agr)" fast-fail class="form" ref="formulario">
        <v-row>
          <v-spacer></v-spacer>
            <v-col cols="12" justify="center" class="title-card">
              <h1 class="texto">Crear agrupación</h1>
              <p class="text-left">Cuéntanos sobre tu comunidad.</p>
            </v-col>
            
            <v-col cols="12" md="12">

              <v-col cols="12" class="namePicker">
                  <v-text-field v-model="nom_act" label="Cómo se llama tu grupo?"
                  clearable required variant="solo-filled"></v-text-field>
              </v-col>

              <v-col cols="12" class="taglist">
                  <v-combobox
                    v-model="tagsSelected"
                    :items="tags"
                    label="Con qué esta relacionado tu grupo?"
                    chips
                    multiple
                    required
                    variant="solo-filled"
                  ></v-combobox>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  class="descripcion"
                  v-model="descripcion"
                  label="Danos una descripción de tu grupo."
                  clearable required variant="solo-filled"
                  height="200px"
                  >
                </v-text-field>
              </v-col>

            </v-col>

            <v-col cols="12" md="4">
            
              <v-col cols="12">
                <v-file-input
                  class="imgpicker"
                  v-model="imagen"
                  accept="image/png, image/jpeg, image/bmp"
                  label="Banner del grupo"
                  clearable
                  required
                  variant="solo-filled"
                  prepend-icon=""
                  @change="onFileChange($event)"
                  @click:clear="urlImagen = defaultImageUrl"
                  >
                </v-file-input>
              </v-col>

            </v-col>

            <v-col cols="12" md="8">
            
            <v-col>
              <v-img 
              class="image"
              max-height="100px"
              aspect-ratio="1"
              :src='urlImagen' />
            </v-col>

          </v-col>
            


            <v-col cols="12" md="12">

              <v-col cols="12" class="bottomElement">
                <v-text-field
                  class="idAct"
                  v-model="id_agr"
                  label="ID de la agrupación"
                  clearable counter required>
                </v-text-field>
              </v-col>

              <v-col cols="4">
                <v-btn class="form-submit" type="submit"
                color="#2CA2DC">Crear grupo</v-btn>
              </v-col>

            </v-col>
              
              </v-row>
              
      </v-form>
    </v-card>
  </v-container>
  </template>
  
<script>
import addImage from '../assets/imagePlaceholder51.png';
  
  export default {
    name: 'HelloWorld',
  
    data: () => ({
      tagsSelected: ['Deporte'],
      tags: ['Deporte', 'Programación', 'Diseño', 'Recreación', 'Videojuegos', 'Aprendizaje'],

      nom_act: '',
      descripcion: '',
      imagen: '',
      tipo: false,
      id_agr: '',
      defaultImageUrl: addImage,
      urlImagen: addImage,
      rut: '',
      rol: '',
    }),
    methods: {
      getRut() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[2] = tokenParts[2].replace('rut=', '');
              return tokenParts[2] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
      },
      getRol() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[0] = tokenParts[0].replace('rol=', '');
              return tokenParts[0] ;
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return null;
      },        
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
        try {
          const today = new Date();
          // Realiza una solicitud fetch a tu backend Fastify
          const response = await fetch(`${global.BACKEND_URL}/actividad`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
            body: JSON.stringify({ nom_act, descripcion, imagen, tipo, id_agr, fecha_creacion: today }),
          });
          // Verifica si la respuesta es exitosa
          if (response.ok) {
            // Convierte la respuesta en formato JSON
            const data = await response.json();
          } else {
            console.error('Error en la respuesta:', response.status);
          }
        } catch (error) {
          console.error('Error al hacer fetch:', error);
        }
      },
    },
    created() {
      this.rut = this.getRut();
      this.rol = this.getRol();
    },
  }
  
</script>
<style>
  .descripcion {
    height: 520px !important;
    margin-top: -20px;
    margin-bottom: -253px;
  }
  .taglist {
    margin-top: -20px;
  }
  .image {
    margin-top: -10px;
    margin-bottom: -20px;
  }
  .imgpicker {
    height: 160px !important;
    margin-top: -10px;
    margin-bottom: -80px;
  }
  .bottomElement {
    margin-top: -0px;
  }
  .title-card {
    margin-left: 12px;
  } 
  .namePicker {
    margin-top: -20px;
  }
</style>