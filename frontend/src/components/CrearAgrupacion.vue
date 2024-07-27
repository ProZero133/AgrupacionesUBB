<template>
    <v-container cols="12"></v-container>
        <v-container cols="12">
            <v-card class="mx-auto px-6 py-8" max-width="800">
                <v-form @submit.prevent="CreaAgrupacion(nombre_agr, descripcion, rut, verificado)" fast-fail class="form" ref="formulario">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="12" justify="center">
                            <h1 class="texto">Crear agrupación</h1>
                            <p class="text-left">Por favor, introducir abajo los datos correspondientes a crear una agrupacion.</p>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field class="nombreAgrupa" v-model="nombre_agr" label="Nombre de la agrupación"
                                clearable counter required></v-text-field>
                        </v-col>
                        <v-col cols="8">
                            <v-text-field class="descripcion" v-model="descripcion" label="Descripción de la agrupación"
                                clearable counter required></v-text-field>
                        </v-col>

                        <v-col cols="9">
                            <v-text-field v-model="rut" label="RUT"
                            clearable counter required></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-btn class="form-submit" type="submit"
                            color="#2CA2DC">Crear Agrupación</v-btn>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="datosDeuda.fechaVencimiento" label="Fecha" type="date" required :min="hoy"
                            :rules="dateRules" :error-messages="dateErrors" @change="validateFechaVencimiento"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-container>
                <v-col cols="9">
                    <v-text-field v-model="rut" label="RUT" clearable counter required></v-text-field>
                </v-col>

                    <v-col cols="8">
                        <v-card class="search-container">
                            <v-card-title>Añadir Tags a la Agrupación</v-card-title>
                            <v-text-field v-model="searchQuery" @input="fetchSearchResults(searchQuery)"
                                append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
                            </v-text-field>
                            <v-card-text>
                                <!-- Aquí se mostrarán los resultados de la búsqueda -->
                                <div class="results-container" v-for="item in searchResults" :key="item.id"
                                    @click="selectItem(item)">
                                    {{ item.nombre_tag }}
                                </div>
                            </v-card-text>
                        </v-card>
                        <v-card class="selected-items-container">
                            <v-card-title>Tags seleccionados</v-card-title>
                                <v-card-text>
                                    <div class="selected-item" v-for="item in selectedItems" :key="item.id">
                                        {{ item.nombre_tag }}
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>

                <v-col cols="3">
                    <v-btn class="form-submit" type="submit"
                    color="#2CA2DC">Crear Agrupación</v-btn>
                </v-col>
</template>
    
    <script>

    export default {
        name: 'CrearAgrupacion',

        data: () => ({
            searchQuery: '',
            searchResults: [],
            nombre_agr: '',
            descripcion: '',
            rut: '',
            verificado: 'Noverificado',
            fecha_verificacion: null,
            tags: [],

            dateErrors: {
                creacion: [],
                verificacion: [],
            },

            dateRules: [
                value => {
                    if (value) return true
                    return 'La fecha es requerida.'
                },
                value => {
                    const today = new Date();
                    const selectedDate = new Date(value);
                    today.setHours(0, 0, 0, 0); // Remove time part
                    selectedDate.setHours(0, 0, 0, 0); // Consistent with today's time removal
                    if (selectedDate >= today) return true;
                    return 'La fecha no puede ser antes de hoy.';
                },
            ],
        }),
    methods: {
        async PostearImagen() {
            try {
                const response = await fetch(`${global.BACKEND_URL}/imagen`, {
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
    
        async login() {
            const response = await fetch(`${global.BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: this.email }),
            });
        },
        async CreaAgrupacion(nombre_agr, descripcion, rut, verificado) {
            try {
                const fecha_creacion= new Date();
                const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre_agr, descripcion, rut, fecha_creacion, verificado}),
                });

                // Verifica si la respuesta es exitosa
                if (response.ok) {
                    // Convierte la respuesta en formato JSON
                    const data = await response.json();
                    console.log(data);
                } else {
                    console.error('Error en la respuesta:', response);
                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },
    },
    }
    
</script>