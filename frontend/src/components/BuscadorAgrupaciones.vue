<template>
  <v-container cols="12"></v-container>
  <v-col cols="12" class="pagina" align-self:>
    <v-row>
      <v-col cols="2" class="flex-grow-0 flex-shrink-0"></v-col>
      <v-col cols="7" class="flex-grow-0 flex-shrink-0">
      <v-btn class="mt-n6" @click="dialogIngresar = true" type="submit" color="#2CA2DC">UNIRSE POR CÓDIGO</v-btn>
        <v-card v-for="grupo in grupos" :key="grupo.id_agr" class="mb-15 card-grupos" border="10px">
          <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
          <!-- Contenedor flex para el contenido, empujando v-card-actions al fondo -->
          <v-card-text class="d-flex flex-column flex-grow-1">
            <div class="flex-grow-1">
              <v-img :src="grupo.imagen" alt="Miniatura" class="miniatura" max-height="200" cover></v-img>
              <p>{{ grupo.verificado }}</p>
            <div class="mb-n12">  
              <p>Tipo: {{ grupo.descripcion }}</p>
            </div>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" text @click="solicitarUnirse(grupo.id_agr)">Solicitar unirse</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog v-model="dialogIngresar" max-width="500px" min-width="400px">
      <v-card text="Ingresar por código de invitación enviado por correo">
        <v-card-title class="acred ml-3">Introduce el código:
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="codigo" label="Código" required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="ingresarPorCodigo">Entrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-col>
</template>

<style scoped>
.pagina {
  margin-top: 60px;
  width: 90%;
}

.justify-end {
  margin-top: 17%;
}

.card-grupos {
  /* O la altura que prefieras para tus v-card */
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  margin-top: 30px;
  /* This centers the card within its container */
  border: 2px solid rgb(207, 207, 207) !important
}

</style>

<script>
export default {
  name: 'BuscadorAgrupaciones',
  data: () => ({
    grupos: [],
    rol: '',
    rut: '',
    codigo: '',
    dialogIngresar: false,
  }),
  methods: {
    // El método entrarPorCódigo recibe de input el código de invitación
    // Envía un fetch al backend /ingresarPorCodigo con el código de invitación y el rut del usuario

    async ingresarPorCodigo() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/ingresarPorCodigo/${this.rut}/${this.codigo}`, {
          method: 'POST',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          console.log('Respuesta:', data);

          this.$root.showSnackBar('success', "Bienvenido al grupo!", 'Código canjeado con éxito.');
          this.$router.push('/api/grupo/' + data.id_agr);

        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },

     getRut() {
          const token = this.$cookies.get('token');
          if (token) {
            try {
              const tokenParts = token.split('&');
              tokenParts[2] = tokenParts[2].replace('rut=', '').trim();
              console.log('Token:', tokenParts[2]);
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
    async VerGrupos() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/agrupacionesnoinscritas/${this.rut}`, {
          method: 'GET',
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();
          //Obtiene la imagen para cada grupo
          const dataTransformada = [];
          for (const imagenes of data){
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagenagrupacion/`+imagenes.id_agr, {
                method: 'GET',
              });
              //Sobre escribe la imagen almacena la data con la nueva imagen en dataTransformada
              if (responde.ok) {
                const dataImagen = await responde.text();
                imagenes.imagen = dataImagen;
                dataTransformada.push(imagenes);
              } else {
                console.error('Error en la respuesta:', responde.status);
              }

            }
            catch (error) {
              console.error('Error al hacer fetch:', error);
          }
        }
          this.grupos = dataTransformada;
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async solicitarUnirse(id_agr){
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/enviarsolicitud/${this.rut}/${id_agr}`, {
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    }

  },
  mounted() {
     this.rut = this.getRut();
    this.rol = this.getRol();
    this.VerGrupos();
  }

}


</script>
