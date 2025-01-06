<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">

    <v-card class="mx-auto px-6 py-8" max-width="800">
      <v-form @submit.prevent="dialog = true" fast-fail class="form" ref="formulario" v-model="formValid">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" justify="center" class="title-card">
            <h1 class="texto">Crear actividad</h1>
            <p class="text-left">Por favor, introducir abajo los datos correspondientes a la actividad a crear.</p>
          </v-col>

          <v-col cols="12" md="7" class="nomdes">
            <v-col cols="12">
              <v-text-field class="nombreAct" v-model="nom_act" label="Nombre de la actividad" clearable required
                variant="solo-filled" :rules="nombreRules"></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea class="descripcionAct" v-model="descripcion" label="Descripción de la actividad" clearable
                required variant="solo-filled" rows="10" no-resize :rules="descrules" counter>
              </v-textarea>
            </v-col>
          </v-col>

          <v-col cols="12" md="5">
            <v-col cols="12">
              <v-file-input v-model="imagen" accept="image/png, image/jpeg, image/bmp" label="Imagen para la actividad"
                clearable required variant="solo-filled" prepend-icon="" :rules="imgRules"
                @change="onFileChange($event)" @click:clear="urlImagen = defaultImageUrl">
              </v-file-input>
            </v-col>
            <v-col>
              <v-img class="image" max-height="280px" aspect-ratio="1" :src='urlImagen' :rules="imgRules" />
            </v-col>
          </v-col>

          <v-col cols="12">
            <v-card class="search-container">
              <v-card-title>Añadir Tags a la Actividad</v-card-title>
              <v-text-field v-model="searchQuery" @input="fetchSearchResults(searchQuery)" append-icon="mdi-magnify"
                label="Buscar..." single-line hide-details>
              </v-text-field>
              <v-card-text>
                <!-- Aquí se mostrarán los resultados de la búsqueda -->
                <v-chip-group>
                  <v-chip class="results-container" v-for="item in searchResults" :key="item.id"
                    @click="selectItem(item)">
                    {{ item.nombre_tag }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
            <v-card class="selected-items-container">
              <v-card-title>Tags seleccionados</v-card-title>
              <v-card-text class="selected-item" v-for="item in tags" :key="item.id">
                <v-chip-group>
                  <v-chip class="selected-item" v-for="item in tags" :key="item.id" @click="eliminarTag(item)">
                    {{ item.nombre_tag }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="12">
            <v-col cols="12" class="bottomElement">
              <v-switch v-model="tipo" :disabled="verificado !== 'Verificado'" inset color="green">
                <template v-slot:label>
                  <div>
                    <h2 v-if=tipo>Actividad Pública</h2>
                    <h2 v-else>Actividad Privada</h2>
                    <h4 v-if=tipo>Todos podrán ver y participar en la actividad, sean miembros del grupo o no.</h4>
                    <h4 v-else>Sólo los miembros del grupo podrán ver y participar de la actividad.</h4>
                    <h4 v-if="verificado !== 'Verificado'" class="warning-message">Debes acreditar tu grupo para crear
                      actividades públicas.</h4>
                  </div>
                </template>
              </v-switch>
            </v-col>
            <v-col cols="6">
              <v-btn class="form-submit" type="submit" color="#2CA2DC" :disabled=!formValid>Crear actividad</v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-form>

      <!-- Dialog for date and cupos -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Detalles de la Actividad</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="dialogForm">
              <v-col>
                <v-text-field v-model="date" label="Fecha para la actividad" type="datetime-local" required :min="hoy"
                  :rules="dateRules" :error-messages="dateErrors"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field class="Cupos" v-model="cupos" label="Cupos para la actividad" type="number" min="1"
                  required :rules="cuposRules"></v-text-field>
              </v-col>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
            <v-btn color="blue darken-1" text
              @click="CreaActividad(nom_act, descripcion, imagen, tipo, cupos, date)">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import addImage from '../assets/imagePlaceholder.png';
import es from 'date-fns/locale/es';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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
    hoy: new Date().toISOString().slice(0, 16),
    descrules: [
      v => !!v || 'Descripción requerida.',
      v => v.length <= 500 || 'Máximo 500 caracteres.'
    ],
    nombreRules: [
      v => !!v || 'Nombre de la actividad requerido.',
      v => v.length <= 50 || 'Máximo 50 caracteres.'
    ],
    cuposRules: [v => !!v || 'Cupos requeridos'],
    fechaRules: [v => !!v || 'Fecha requerida'],
    dateRules: [
      value => {
        if (value) return true
        return 'La fecha es requerida.'
      },
      value => {
        const inputDate = new Date(value);
        const today = new Date();
        if (inputDate >= today) return true
        return `La fecha no puede ser antes que la actual.`
      },
    ],
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
    dateErrors: [],
    formValid: false,


    nom_act: '',
    descripcion: '',
    imagen: [],
    tipo: false,
    id_agr: '',
    defaultImageUrl: addImage,
    urlImagen: addImage,
    idImagen: '',
    dialog: false,
    formValid: false,
    verificado: '',
    cupos: 1,
    date: null,
    rut: '',
    rol: '',
    searchQuery: '',
    searchResults: [],
    tags: [],
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

    createImage(file) {
      const reader = new FileReader();
      const actualFile = file[0];
      reader.onload = e => {
        this.urlImagen = e.target.result;
      };
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
    async getVerificado() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones/${this.groupId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.verificado = data.verificado;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async CreaActividad(nom_act, descripcion, imagen, tipo, cupos) {
      const fecha = new Date();
      const hoy = formatInTimeZone(fecha, 'America/Santiago', 'yyyy-MM-dd HH:mm:ss.SSS');
      //Validar todos los campos antes de insertar imagen
      const isValid = this.$refs.formulario.validate();
      if (!isValid) {
        this.$root.showSnackBar('error', 'Por favor, rellene todos los campos', 'Error de validación');
        return;
      }
      //Validar fecha igual o mayor a la actual
      if (this.date < this.hoy) {
        this.$root.showSnackBar('error', 'Fecha no válida', 'Error de validación');
        return;
      }
      if (this.urlImagen == this.defaultImageUrl || this.urlImagen == '') {
        console.error('Error al subir la imagen');
        this.$root.showSnackBar('error', 'Falta subir una imagen!', 'Error de subida');
        return;
      }
      await this.PostearImagen();
      if (this.idImagen === '' || !this.urlImagen) {
        console.error('Error al subir la imagen');
        this.$root.showSnackBar('error', 'La imagen no es válida', 'Error de subida');
        return;
      }
      else {
        try {
          const response = await fetch(`${global.BACKEND_URL}/actividades`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
            },
            body: JSON.stringify({ nom_act, descripcion, imagen: this.idImagen, tipo, id_agr: this.groupId, cupos }),
          });
          // Verifica si la respuesta es exitosa
          const datos = await response.json();
          const data = datos.data;
          if(datos.success === false){
            this.$root.showSnackBar('error', data.message, 'Error de creación');
            return;
          }
          if (response.ok) {
            this.dialog = false;
            const id_act = data.id_act;
            const fecha_actividad = this.date; // Convierte la fecha al formato YYYY-MM-DD
            if(fecha_actividad === null){
              this.tags.forEach(tag => this.RegistrarTag(tag.id_tag, id_act));
              this.$root.showSnackBar('success', 'Actividad creada sin programación', 'Éxito');
              this.$router.push(`/api/grupo/${this.groupId}`);
            }
            const programarActividad = await fetch(`${global.BACKEND_URL}/programar/${id_act}/${this.groupId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
              },
              body: JSON.stringify({ fecha_actividad }),
            });
            const programacion = await programarActividad.json();

            this.$router.push(`/api/grupo/${this.groupId}`);
            this.$root.showSnackBar('success', nom_act, 'Publicada con éxito!');
            this.tags.forEach(tag => this.RegistrarTag(tag.id_tag, id_act));
          } else {
            console.error('Error en la respuesta:', response.status);
          }

        } catch (error) {
          console.error('Error al hacer fetch:', error);
        }
      }
    },
    async fetchSearchResults(searchValue) {
      // Convertir searchValue a cadena explícitamente
      const stringValue = searchValue.trim();
      if (stringValue === '') {
        this.searchResults = [];
        return;
      }
      try {
        const response = await fetch(`${global.BACKEND_URL}/buscarTags/${stringValue}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
          },
        });
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        this.searchResults = data; // Asegúrate de que esto coincida con el formato de tu respuesta
      } catch (error) {
        console.error('Error al buscar:', error);
        this.searchResults = [];
      }
    },
    selectItem(item) {
      this.tags.push(item); // Añade el item a la lista de seleccionados
      this.searchResults = this.searchResults.filter(i => i.id !== item.id); // Elimina el item de `searchResults`
    },
    async eliminarTag(item) {
      this.tags = this.tags.filter(tag => tag.id !== item.id);
    },
    async RegistrarTag(id_tag, id_act) {
            try {
                const response = await fetch(`${global.BACKEND_URL}/ingresartagsactividad`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                    body: JSON.stringify({ id_tag: id_tag, id_act: id_act }),
                });
                if (response.ok) {
                    const data = await response.json();
                } else {
                    console.error('Error en la respuesta:', response);
                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },
  },
  mounted() {
    this.rut = this.getRut();
    this.rol = this.getRol();
    this.getVerificado();
  },
}

</script>
<style>
.nomdes {
  margin-bottom: 220px;
}

.fechaActividad {
  margin-top: 2px;
  height: 405px;
}

.descripcionAct {
  height: 20px !important;
  margin-top: -20px;
}

.image {
  margin-top: -20px;
  margin-bottom: -20px;
}

.bottomElement {
  margin-top: 0px;
}

.title-card {
  margin-left: 12px;
}

.botcosos {
  margin-bottom: -40px;
}
</style>