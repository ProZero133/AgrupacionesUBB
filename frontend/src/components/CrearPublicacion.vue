<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-card class="mx-auto px-6 py-8" max-width="800">
      <v-form @submit.prevent="formSubmit(nom_pub, descripcion, imagen, tipo)" fast-fail class="form" ref="formulario">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" justify="center" class="title-card">
            <h1 class="texto">Crear publicación</h1>
            <p class="text-left">Por favor, selecciona el tupo de publicación que quieres hacer, y luego rellena los
              datos correspondientes.</p>
          </v-col>

          <v-col cols="7">
            <v-select label="Tipo de publicación" :items="['Post', 'Formulario']" v-model="tipo"
              class="ml-3 mb-n9 mr-3"></v-select>
          </v-col>

          <v-col cols="12" md="7">

            <v-col cols="12">
              <v-text-field v-model="nom_pub" label="Nombre de la publicación" clearable required variant="solo-filled"
                :rules="namerules"></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea class="descripcionAct" v-model="descripcion" label="Descripción de la publicación" clearable
                required variant="solo-filled" rows="10" no-resize :rules="descrules" counter>
              </v-textarea>
            </v-col>

          </v-col>

          <v-col cols="12" md="5" class="img">

            <v-col cols="12">
              <v-file-input v-model="imagen" accept="image/png, image/jpeg, image/bmp"
                label="Imagen para la publicación" clearable required variant="solo-filled" prepend-icon=""
                @change="onFileChange($event)" @click:clear="urlImagen = defaultImageUrl" :rules="imgRules">
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

          <template v-for="(opcion, index) in opciones">
            <v-row v-if="tipo == 'Votación'" class="ml-3">
              <v-col cols="12" md="1">
                <v-checkbox-btn class="mt-2" disabled></v-checkbox-btn>
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field :label="'Opción ' + (index + 1)" v-model="opciones[index]" hide-details></v-text-field>
              </v-col>

              <v-col cols="12" md="2" class="ml-3 mt-2" color="warning">
                <v-btn @click="deleteOption(index)" :disabled="this.opciones.length < 2">
                  ELIMINAR
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <v-container>
            <button type="button" @click="addOption" class="butt ml-6 mt-2">
              <p style="color:#2CA2DC"><b>+ Añadir opción</b></p>
            </button>
          </v-container>

        </template>

        <template v-if="tipo == 'Formulario'">

          <v-col cols="12">
            <v-text-field v-model="enlace" label="Hipervínculo del formulario" clearable required variant="solo-filled"
              class="mb-n7 mt-3"></v-text-field>
          </v-col>

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
    namerules: [v => v.length <= 50 || 'Máximo 50 carácteres.'],
    descrules: [v => v.length <= 500 || 'Máximo 500 carácteres.'],
    imgRules: [
      value => {
        return (
          !value ||
          !value.length ||
          value[0].size < 1000000 ||
          'Tamaño máximo de imagen: 1MB.'
        );
      },
      v => !!v || 'La imagen es requerida.'
    ],
    nom_pub: '',
    descripcion: '',
    imagen: [],
    tipo: 'Post',
    tipoReal: '',
    id_agr: '',
    defaultImageUrl: addImage,
    urlImagen: addImage,
    idImagen: '',
    opciones: ['Si', 'No'],
    pubId: 0,
    rut: '',
    rol: '',
    enlace: 'https://forms.gle/',

    subiendo: false,
  }),

  methods: {
    getRut() {
      const token = this.$cookies.get('token');
      if (token) {
        try {
          const tokenParts = token.split('&');
          tokenParts[2] = tokenParts[2].replace('rut=', '');
          return tokenParts[2];
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
          return tokenParts[0];
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
      return null;
    },
    formSubmit() {
      this.tipoReal = this.tipo;
      this.subiendo = true;
      this.CreaPublicacion();
    },
    disabledForm() {
      if ((this.tipo === 'Votación' && (this.opciones.length < 2 || this.opciones.includes('') || this.opciones.length > 13)) || this.subiendo) {
        return true;
      } else {
        return false;
      }
    },
    deleteOption(index) {
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

    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) {
        this.urlImagen = this.defaultImageUrl;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        this.urlImagen = reader.result;
      };
      reader.readAsDataURL(file);
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
        const response = await fetch(`${global.BACKEND_URL}/imagen`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({ imagen: this.urlImagen }),
        });
        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
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

      if (this.urlImagen == this.defaultImageUrl || this.urlImagen == '') {
        this.subiendo = false;
        console.error('Error al subir la imagen');
        this.$root.showSnackBar('error', 'Falta subir una imagen!', 'Error de subida');
        return;
      }
      await this.PostearImagen();
      if (this.idImagen === '' || !this.urlImagen) {
        this.subiendo = false;
        console.error('Error al subir la imagen');
        this.$root.showSnackBar('error', 'La imagen no es válida', 'Error de subida');
        return;
      }
      else {
        try {
          const response = await fetch(`${global.BACKEND_URL}/publicaciones`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
            body: JSON.stringify({
              encabezado: this.nom_pub,
              imagen: this.idImagen,
              id_agr: this.groupId,
              rut: this.rut,
              fecha_publicacion: today
            }),
          });
          // Verifica si la respuesta es exitosa
          if (response.ok) {
            // Convierte la respuesta en formato JSON
            this.pubId = await response.json();

            // Si tipoReal es 'Post', se ejecuta crearPost. Si es 'Formulario', se ejecuta crearFormulario. Si es otro valor, se muestra un mensaje de error.
            if (this.tipoReal === 'Post') {
              this.crearPost();
            } else if (this.tipoReal === 'Formulario') {
              this.crearFormulario();
            } else {
              this.$root.showSnackBar('error', this.tipoReal, 'Error de creación: Tipo de publicación no válido');
            }
            // Luego de eso, aca hay que poner el codigo para subir las opciones de la votación. Pendiente.
          } else {
            this.subiendo = false;
            this.$root.showSnackBar('error', 'No se pudo subir la publicación', 'Error de subida');
            console.error('Error en la respuesta:', response.status);
          }
        } catch (error) {
          this.subiendo = false;
          console.error('Error al hacer fetch:', error);
        }
      }
    },


    async crearFormulario() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/formulario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({ id_pub: this.pubId, descripcion: this.descripcion, hipervinculo: this.enlace }),
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          await this.notificarPublicacion(this.pubId);

          const data = await response.json();
          this.$root.showSnackBar('success', 'Formulario creado con éxito!');
          this.$router.push(`/api/grupo/${this.groupId}`);
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async crearPost() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({ id_pub: this.pubId, cuerpo: this.descripcion }),
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          await this.notificarPublicacion(this.pubId);
          this.$root.showSnackBar('success', 'Post creado con éxito!');
          this.$router.push(`/api/grupo/${this.groupId}`);
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async notificarPublicacion(id_pub) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/notificarMiembrosPublicacion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
          body: JSON.stringify({ id_pub }),
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
  mounted() {
    this.rut = this.getRut();
    this.rol = this.getRol();
    this.opcionesCounter = this.opciones.length;
  }
}

</script>
<style>
.descripcionAct {
  height: 20px !important;
  margin-top: -20px;
  margin-bottom: 230px;
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

.butt {
  width: 1200px;
}
</style>