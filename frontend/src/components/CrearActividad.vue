<template>

  <v-container cols="12"></v-container>
  <v-container cols="12">
    <v-card class="mx-auto px-6 py-8" max-width="800">
      <v-form @submit.prevent="CreaActividad(nom_act, descripcion, imagen, tipo, cupos)" fast-fail class="form"
        ref="formulario">
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" justify="center" class="title-card">
            <h1 class="texto">Crear actividad</h1>
            <p class="text-left">Por favor, introducir abajo los datos correspondientes a la actividad a crear.</p>
          </v-col>

          <v-col cols="12" md="7">

            <v-col cols="12">
              <v-text-field class="nombreAct" v-model="nom_act" label="Nombre de la actividad" clearable required
                variant="solo-filled" :rules="nombreRules"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field class="Cupos" v-model="cupos" label="Cupos para la actividad" type="number"
                min="1" required :rules="cuposRules"></v-text-field>
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
                clearable required variant="solo-filled" prepend-icon="" @change="onFileChange($event)"
                @click:clear="urlImagen = defaultImageUrl">
              </v-file-input>
            </v-col>

            <v-col>
              <v-img class="image" max-height="280px" aspect-ratio="1" :src='urlImagen' />
            </v-col>
            <v-col>
              <v-date-picker class="fechaActividad" title="Fecha para la actividad" header="Fecha" v-model="date" locale="es" color="primary" required :rules="fechaRules"></v-date-picker>
            </v-col>

          </v-col>


          <v-col cols="12" md="12">

            <v-col cols="12" class="bottomElement">

              <v-checkbox v-model="tipo" :disabled="verificado !== 'Verificado'">
                <template v-slot:label>
                  <div>
                    <h2 v-if=tipo>Actividad Pública: Activado</h2>
                    <h2 v-else>Actividad Pública: Desactivado</h2>
                    <h4 v-if=tipo>Todos podrán ver y participar en la actividad, sean miembros del grupo o no.</h4>
                    <h4 v-else>Sólo los miembros del grupo podrán ver y participar de la actividad.</h4>
                    <h4 v-if="verificado !== 'Verificado'" class="warning-message">Debes acreditar tu grupo para crear
                      actividades públicas.</h4>
                  </div>
                </template>
              </v-checkbox>

            </v-col>

            <!-- <v-col cols="12">
              <v-text-field class="idAct" v-model="id_agr" label="ID de la agrupación" clearable counter required>
              </v-text-field>
            </v-col> -->

            <v-col cols="4">
              <v-btn class="form-submit" type="submit" color="#2CA2DC">Crear actividad</v-btn>
            </v-col>

          </v-col>

        </v-row>

      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import addImage from '../assets/imagePlaceholder.png';
import es from 'date-fns/locale/es';
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
    nombreRules: [v => !!v || 'Nombre de la actividad requerido'],
    cuposRules: [v => !!v || 'Cupos requeridos'],
    fechaRules: [v => !!v || 'Fecha requerida'],
    nom_act: '',
    descripcion: '',
    imagen: [],
    tipo: false,
    id_agr: '',
    defaultImageUrl: addImage,
    urlImagen: addImage,
    idImagen: '',
    verificado: '',
    cupos: 1,
    date: null,
  }),
  methods: {
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
        const response = await fetch(`http://localhost:3000/agrupaciones/${this.groupId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.rows && data.rows.length > 0) {
            this.verificado = data.rows[0].verificado;
          } else {
            console.error('No se encontraron filas en la respuesta');
          }
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

    async CreaActividad(nom_act, descripcion, imagen, tipo, cupos) {
      //Validar todos los campos antes de insertar imagen
      const isValid = this.$refs.formulario.validate();
      if (!isValid) {
        this.$root.showSnackBar('error', 'Por favor, rellene todos los campos', 'Error de validación');
        return;
      }
      //Validar fecha igual o mayor a la actual
      const fechaActual = new Date();
      if (this.date < fechaActual) {
        this.$root.showSnackBar('error', 'Fecha no válida', 'Error de validación');
        return;
      }
      await this.PostearImagen();
      if (this.idImagen === '') {
        console.error('Error al subir la imagen');
        this.$root.showSnackBar('error', 'Imagen ya existe', 'Error de subida');
        return;
      }
      else {
        try {
          const response = await fetch('http://localhost:3000/actividades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom_act, descripcion, imagen: this.idImagen, tipo, id_agr: this.groupId, cupos }),
          });
          // Verifica si la respuesta es exitosa
          if (response.ok) {
            // Convierte la respuesta en formato JSON
            const data = await response.json();
            const id_act = data.id_act;
            const fecha_actividad = new Date(this.date).toISOString().split('T')[0]; // Convierte la fecha al formato YYYY-MM-DD
            console.log("Fecha para la actividad: "+fecha_actividad);
            const programarActividad = await fetch(`http://localhost:3000/programar/${id_act}/${this.groupId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fecha_actividad }),
            });




            this.$router.push(`/api/grupo/${this.groupId}`);
            this.$root.showSnackBar('success', nom_act, 'Publicada con éxito!');
          } else {
            console.error('Error en la respuesta:', response.status);
          }


        } catch (error) {
          console.error('Error al hacer fetch:', error);
        }
      }
    },
  },
  mounted() {
    this.getVerificado();
  },
}

</script>
<style>
.fechaActividad {
  margin-top: 2px;
  height: 405px;
}
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
  margin-top: 0px;
}

.title-card {
  margin-left: 12px;
}
</style>