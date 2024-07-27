<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif"
          class="my-3" contain height="500" />
      </v-col>
      <v-btn variant="tonal" @click="SaludoBackend">
        Button
      </v-btn>
      <v-col cols="12">
        <form @submit.prevent="login">
          <input type="email" v-model="email" placeholder="Enter your email" required>
          <button type="submit">Login</button>
        </form>
      </v-col>
      <v-col cols="12">
        <form
          @submit.prevent="CreaAgrupacion(nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion)">
          <input type="text" v-model="nombre_agr" placeholder="Nombre de la agrupación" required>
          <input type="text" v-model="descripcion" placeholder="Descripción" required>
          <input type="text" v-model="rut" placeholder="Rut" required>
          <input type="date" v-model="fecha_creacion" placeholder="Fecha de creación" required>
          <input type="checkbox" v-model="verificado" placeholder="Verificado" required>
          <input type="date" v-model="fecha_verificacion" placeholder="Fecha de verificación" required>
          <button type="submit">Crear agrupación</button>
        </form>
      </v-col>
      <v-container>
        <v-col cols="8">
          <v-card title="Crear actividad" subtitle="Ingrese los datos de su actividad" text="..." variant="tonal">
            <v-card-actions>
              <form @submit.prevent="CreaActividad(nom_act, descripcion, imagen, tipo, id_agr)">
                <div>
                  <input type="text" v-model="nom_act" placeholder="Nombre de la actividad" requires>
                </div>
                <div>
                  <input type="text" v-model="descripcion" placeholder="Descripción" requires>
                </div>
                <div>
                  <input type="text" v-model="imagen" placeholder="Imagen">
                </div>
                <div>
                  <label for="tipo">Seleccione el tipo de actividad</label>
                  <select v-model="tipo">
                    <option value="false">Privado</option>
                    <option value="true">Público</option>
                  </select>
                </div>
                <div>
                  <input type="text" v-model="id_agr" placeholder="Id de la agrupación" requires>
                </div>
                <div>
                  <button type="submit">Crear actividad</button>
                </div>
              </form>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-container>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to the Vuetify 3 Beta
        </h1>

        <h4>Vite Preview</h4>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a href="https://community.vuetifyjs.com" target="_blank">Discord Community</a>
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">
          What's next?
        </h2>

        <v-row justify="center">
          <a v-for="(next, i) in whatsNext" :key="i" :href="next.href" class="subheading mx-3" target="_blank">
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Important Links
        </h2>

        <v-row justify="center">
          <a v-for="(link, i) in importantLinks" :key="i" :href="link.href" class="subheading mx-3" target="_blank">
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Ecosystem
        </h2>

        <v-row justify="center">
          <a v-for="(eco, i) in ecosystem" :key="i" :href="eco.href" class="subheading mx-3" target="_blank">
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import logo from '../assets/logo.svg'

export default {
  name: 'HelloWorld',

  data: () => ({
    nombre_agr: '',
    descripcion: '',
    rut: '',
    fecha_creacion: '',
    verificado: false,
    fecha_verificacion: '',
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader/tree/next',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify/tree/next',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com',
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify',
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs',
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify',
      },
    ],
    logo,
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Roadmap',
        href: 'https://vuetifyjs.com/introduction/roadmap/',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],
  }),
  methods: {
    async SaludoBackend() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/usuarios`, {
          method: 'GET',
          // Puedes agregar más configuraciones a la solicitud aquí si es necesario
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();

          // Haz algo con los datos recibidos
          console.log(data);
          // Puedes guardar los datos en el estado de tu componente o realizar otras acciones
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async ObtenAgrupaciones() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
          method: 'GET',
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
    async login() {
      const response = await fetch(`${global.BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email }),
      });
    },
    async ObtenAgrupaciones() {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
          method: 'GET',
          // Puedes agregar más configuraciones a la solicitud aquí si es necesario
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
          // Convierte la respuesta en formato JSON
          const data = await response.json();

          // Haz algo con los datos recibidos
          console.log(data);
          // Puedes guardar los datos en el estado de tu componente o realizar otras acciones
        } else {
          console.error('Error en la respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al hacer fetch:', error);
      }
    },
    async CreaAgrupacion(nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion) {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        console.log(nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion);

        const response = await fetch(`${global.BACKEND_URL}/agrupacion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion }),
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
    async CreaActividad(nom_act, descripcion, imagen, tipo, id_agr) {
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
    }
  },
}

</script>
