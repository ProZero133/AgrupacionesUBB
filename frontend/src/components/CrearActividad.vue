<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif"
          class="my-3" contain height="500" />
      </v-col>
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
    </v-row>
  </v-container>
</template>

<script>


export default {
  name: 'HelloWorld',

  data: () => ({
  }),
  methods: {
    async CreaActividad(nom_act, descripcion, imagen, tipo, id_agr) {
      try {
        // Realiza una solicitud fetch a tu backend Fastify
        const response = await fetch('http://localhost:3000/actividad', {
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
