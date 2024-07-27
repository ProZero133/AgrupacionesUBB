<template>
    <v-container cols="12"></v-container>
    <v-container cols="12">
      <v-card class="mx-auto px-6 py-8" max-width="800">
        <v-form @submit.prevent="CreaTag" fast-fail class="form" ref="formulario">
          <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="12" justify="center">
                        <h1 class="texto">Crear Tag</h1>
                        <p class="text-left">Por favor, introducir abajo los datos correspondientes al tag a crear.</p>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field class="nombreTag" v-model="nombre_tag" label="Nombre del tag"
                            clearable counter required></v-text-field>
                    </v-col>

                    <v-col cols="8">
                        <v-text-field class="rut" v-model="rut" label="Rut"
                        clearable counter required></v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-btn class="form-submit" type="submit"
                      color="#2CA2DC">Crear Tag</v-btn>
                    </v-col>

            </v-row>
        </v-form>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'CrearTag',

    data: () => ({
        nombre_tag: '',
        rut: ''
    }),

    methods: {
        async CreaTag() {
            try {
                const response = await fetch('http://localhost:3000/tags', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre_tag: this.nombre_tag,
                        rut: this.rut
                    })
                });
                if (response.ok) {
                    this.$router.push('/tags');
                } else {
                    console.log('Error al crear tag');
                }
            } catch (error) {
                console.log('Error al crear tag');
            }
        }
    }
}
</script>
