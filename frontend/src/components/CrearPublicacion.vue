<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-card class="mx-auto px-6 py-8" max-width="800">
      <v-form @submit.prevent="CreaPublicacion(nom_pub, descripcion, imagen, tipo)" fast-fail class="form"
        ref="formulario">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" justify="center" class="title-card">
            <h1 class="texto">Crear publicación</h1>
            <p class="text-left">Por favor, selecciona el tupo de publicación que quieres hacer, y luego rellena los datos correspondientes.</p>
          </v-col>

          <v-col cols="7">
            <v-select
            label="Tipo de publicación"
            :items="['Post', 'Votación', 'Formulario']"
            v-model="tipo"
            class="ml-3 mb-n9 mr-3"
            ></v-select>
          </v-col>

          <v-col cols="12" md="7">

            <v-col cols="12">
              <v-text-field v-model="nom_pub" label="Nombre de la publicación" clearable required
                variant="solo-filled"></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
              class="descripcionAct"
              v-model="descripcion"
              label="Descripción de la publicación"
              clearable
              required
              variant="solo-filled"
              rows="10"
              no-resize
              :rules="descrules"
              counter>
              </v-textarea>
            </v-col>

          </v-col>

          <v-col cols="12" md="5">

            <v-col cols="12">
              <v-file-input v-model="imagen" accept="image/png, image/jpeg, image/bmp" label="Imagen para la publicación"
                clearable required variant="solo-filled" prepend-icon="" @change="onFileChange($event)"
                @click:clear="urlImagen = defaultImageUrl">
              </v-file-input>
            </v-col>

            <v-col>
              <v-img class="image" max-height="280px" aspect-ratio="1" :src='urlImagen' />
            </v-col>

          </v-col>

        </v-row>

    <template v-if="tipo == 'Votación'">

      <v-col cols="12" justify="center" class="title-card mt-3 mb-4">
        <h1 class="texto">Opciones</h1>
        <p class="text-left">Ingresa valores para las opciones de la votación.</p>
      </v-col>

      <template v-for = "(opcion, index) in opciones">
        <v-row v-if="tipo == 'Votación'" class="ml-3">
          <v-col cols="12" md="1">
            <v-checkbox-btn class="mt-2"
              disabled
            ></v-checkbox-btn>
          </v-col>

          <v-col cols="12" md="8">
            <v-text-field
              :label="'Opción ' + (index+1)"
              v-model="opciones[index]"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2" class="ml-3 mt-2" color="warning">
            <v-btn @click="deleteOption(index)" :disabled="this.opciones.length < 2">
              ELIMINAR
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <v-container>
        <button type="button" @click="addOption" class="ml-6 mt-2"><p style="color:#2CA2DC"><b>+ Añadir opción</b></p></button>
      </v-container>
    
    </template>

      <v-col cols="4">
        <v-btn :disabled="disabledForm()" class="form-submit mb-n5" type="submit">Crear publicación</v-btn>
      </v-col>

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
  name: 'HelloWorld',

  data: () => ({
    descrules: [v => v.length <= 500 || 'Máximo 500 carácteres.'],
    nom_pub: '',
    descripcion: '',
    imagen: [],
    tipo: 'Post',
    id_agr: '',
    defaultImageUrl: addImage,
    urlImagen: addImage,
    idImagen: '',
    opciones: ['Si','No'],
    pubId: 0,
  }),
  methods: {
    formSubmit() {
      if (this.tipo === 'Votación') {
        this.CreaPublicacion();
      } else {
        console.log('que');
      }
    },
    disabledForm() {
      if (this.tipo === 'Votación' && (this.opciones.length < 2 || this.opciones.includes('') || this.opciones.length > 13)) {
        return true;
      } else {
        return false;
      }
    },
    deleteOption(index){
      this.opciones.splice(index, 1);
    },
    addOption() {
      this.opciones.push('');
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



//    createImage(file) {
//      const reader = new FileReader();

      // Extract the File object from the Proxy
//      const actualFile = file[0];

      //reader.onload = e => {
        //this.urlImagen = e.target.result;
      //};

      // Ensure the extracted object is a File before calling readAsDataURL
      //if (actualFile instanceof File) {
        //reader.readAsDataURL(actualFile);
      //} else {
        //console.error("El archivo presentado no es un archivo.");
      //}
    //},


    onFileChange(e) {
      const file = e.target.files[0];
      console.log(file) 
      if (!file) {
        this.urlImagen = this.defaultImageUrl;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        this.urlImagen = reader.result;
      };
      reader.readAsDataURL(file);

      console.log("file");
      console.log(this.urlImagen);
    },

    fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            let base64String = reader.result;
            // Remover el prefijo "data:image/png;base64," o similar
            base64String = base64String.replace(/^data:image\/\w+;base64,/, '');
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
},

async PostearImagen() {
  try {
    const response = await fetch('http://localhost:3000/imagen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagen: this.urlImagen }),
    });
    // Verifica si la respuesta es exitosa
    if (response.ok) {
      // Convierte la respuesta en formato JSON
      const data = await response.json();
      console.log("Imagen subida");
      this.idImagen = data.id_imagen;
    } else {
      console.error('Error en la respuesta:', response.status);
    }
  } catch (error) {
    console.error('Error al hacer fetch:', error);
  }
},

  async CreaPublicacion() {

    const today = new Date().toISOString();

    await this.PostearImagen();
    if (//this.idImagen === ''
    false
    ) {
      console.error('Error al subir la imagen');
      this.$root.showSnackBar('error', 'Imagen ya existe', 'Error de subida');
      return;
    }
    else {
      console.log("todo bien!");
      console.log(this.idImagen);
      try {

          console.log("json");
          console.log(JSON.stringify({
            encabezado: this.nom_pub,
            imagen: this.idImagen,
            id_agr: this.groupId,
            rut: '20.999.554-9',
            fecha_publicacion: today
          }));
          const response = await fetch('http://localhost:3000/publicaciones', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              encabezado: this.nom_pub,
              imagen: 3,
              id_agr: this.groupId,
              rut: '20.999.554-9',
              fecha_publicacion: today}),
          });
          // Verifica si la respuesta es exitosa
          if (response.ok) {
            // Convierte la respuesta en formato JSON
            this.pubId = await response.json();
            console.log("Publicación creada");
            console.log(this.pubId);
            // Luego de eso, aca hay que poner el codigo para subir las opciones de la votación. Pendiente.
            this.$router.push(`/api/grupo/${this.groupId}`);
            this.$root.showSnackBar('success', data.id_pub, 'Publicada con éxito!');
            } else {
              console.error('Error en la respuesta:', response.status);
              console.log(response)
            }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    }
  },
},
mounted() {
  this.opcionesCounter = this.opciones.length;
}
}

</script>
<style>
.descripcionAct {
  height: 20px !important;
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