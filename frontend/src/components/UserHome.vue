<template>
  <div class="contenedor">
  <div class="ActividadGrupos">
    <v-card v-for="actividad in actividades" :key="actividad.id_act" class="mb-3 card">
      <v-card-title>{{ actividad.nom_act }}</v-card-title>
      <v-card-text>
        <p>{{ actividad.descripcion }}</p>
        <p>Tipo: {{ actividad.tipo }}</p>
      </v-card-text>
    </v-card>
  </div>
  <div class="misgrupos">
    <v-card v-for="grupo in grupos" :key="grupo.id_agr" class="mb-3 card">
      <v-card-title>{{ grupo.nombre_agr }}</v-card-title>
      <v-card-text>
        <p>{{ grupo.descripcion }}</p>
        <p>RUT: {{ grupo.rut }}</p>
        <p>Fecha de creación: {{ grupo.fecha_creacion }}</p>
        <p>Verificado: {{ grupo.verificado ? 'Sí' : 'No' }}</p>
        <p v-if="grupo.verificado">Fecha de verificación: {{ grupo.fecha_verificacion }}</p>
      </v-card-text>
    </v-card>
  </div>
</div>
</template>

<style scoped>
.contenedor {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.ActividadGrupos {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que el contenedor tenga al menos el alto de la ventana */
  margin-top: 100px;
  margin-left: 400px;
  margin-right: 100px;
}
.misgrupos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Asegura que el contenedor tenga al menos el alto de la ventana */
  margin-top: 100px;
}

.card {
  max-width: 600px; /* O el ancho máximo que prefieras para tus v-card */
}
</style>

<script>
export default {
    name: 'UserHome',
    data: () => ({
       grupos: [],
       actividades: []
    }),
    methods: {
        async VerGrupos() {
            try {
                // Realiza una solicitud fetch a tu backend Fastify
                const response = await fetch('http://localhost:3000/VerGrupos', {
                    method: 'GET',
                });

                // Verifica si la respuesta es exitosa
                if (response.ok) {
                    // Convierte la respuesta en formato JSON
                    const data = await response.json();
                    console.log(data);
                    this.grupos = data;
                } else {
                    console.error('Error en la respuesta:', response.status);
                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },
        async VerActividades() {
            try {
                // Realiza una solicitud fetch a tu backend Fastify
                const response = await fetch('http://localhost:3000/VerActividadesGrupos', {
                    method: 'GET',
                });

                // Verifica si la respuesta es exitosa
                if (response.ok) {
                    // Convierte la respuesta en formato JSON
                    const data = await response.json();
                    console.log(data);
                    this.actividades = data;
                } else {
                    console.error('Error en la respuesta:', response.status);
                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        }
    },
    mounted() {
        this.VerGrupos();
        this.VerActividades();
    }

}


</script>
