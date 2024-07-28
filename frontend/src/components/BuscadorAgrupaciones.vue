<template>
  <v-container cols="12"></v-container>
  <v-col cols="12" class="pagina" align-self:>
    <v-row>
      <v-col cols="2" class="flex-grow-0 flex-shrink-0"></v-col>
      <v-col cols="7" class="flex-grow-0 flex-shrink-0">
        <v-card v-for="grupo in grupos" :key="grupo.id_agr" class="mb-15 card-grupos" border="10px">
          <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
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
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  margin-top: -40px;
  border: 2px solid rgb(207, 207, 207) !important;
}
</style>

<script>
export default {
  name: 'BuscadorAgrupaciones',
  data: () => ({
    grupos: [],
    rol: '',
    rut: '',
    preferencias: [],
  }),
  methods: {
    getRut() {
      const token = this.$cookies.get('token');
      if (token) {
        try {
          const tokenParts = token.split('&');
          tokenParts[2] = tokenParts[2].replace('rut=', '').trim();
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
    async obtenerPreferencias() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/obtenerPreferencias/${this.rut}`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            this.preferencias = data
              .filter(pref => pref.nombre_tag && typeof pref.nombre_tag === 'string')
              .map(pref => pref.nombre_tag.toLowerCase());
            console.log('Preferencias del usuario:', this.preferencias);
            this.VerGrupos();
          } else {
            console.error('Unexpected response format', data);
          }
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async VerGrupos() {
      try {
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Datos de grupos obtenidos:', data);
          const dataTransformada = [];
          for (const imagenes of data) {
            try {
              const responde = await fetch(`${global.BACKEND_URL}/imagenagrupacion/` + imagenes.id_agr, {
                method: 'GET',
              });
              if (responde.ok) {
                const dataImagen = await responde.text();
                imagenes.imagen = dataImagen;
                dataTransformada.push(imagenes);
              } else {
                console.error('Error en la respuesta de imagen:', responde.status);
              }
            } catch (error) {
              console.error('Error al hacer fetch de imagen:', error);
            }
          }
          this.grupos = dataTransformada;
          console.log('Grupos con datos de imagen:', this.grupos);
          this.ordenarGruposPorPreferencias();
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    ordenarGruposPorPreferencias() {
      if (this.preferencias.length > 0) {
        this.grupos.sort((a, b) => {
          const aCoincidencias = a.tags?.filter(tag => this.preferencias.includes(tag.toLowerCase())).length || 0;
          const bCoincidencias = b.tags?.filter(tag => this.preferencias.includes(tag.toLowerCase())).length || 0;
          return bCoincidencias - aCoincidencias;
        });
        console.log('Grupos ordenados por preferencias:', this.grupos);
      }
    },
    async solicitarUnirse(id_agr) {
      try {
        const response = await fetch(`${global.BACKEND_URL}/enviarsolicitud/${this.rut}/${id_agr}`, {
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Respuesta de solicitud:', data);
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
    this.obtenerPreferencias();
  }
}
</script>
