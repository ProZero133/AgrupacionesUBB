<template>
    <v-container cols="12"></v-container>
    <v-container cols="12">
        <v-card class="mx-auto px-6 py-8" max-width="800">
            <v-form @submit.prevent="CreaAgrupacion(nombre_agr, descripcion, rut)" fast-fail class="form"
                ref="formulario">
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="12" justify="center">
                        <h1 class="texto">Crear agrupación</h1>
                        <p class="text-left">Por favor, introducir abajo los datos correspondientes a crear una
                            agrupacion.</p>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field class="nombreAgrupa" v-model="nombre_agr" label="Nombre de la agrupación"
                            clearable counter required></v-text-field>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field class="descripcion" v-model="descripcion" label="Descripción de la agrupación"
                            clearable counter required></v-text-field>
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
                        <v-btn class="form-submit" type="submit" color="#2CA2DC">Crear Agrupación</v-btn>
                    </v-col>

                </v-row>

            </v-form>
        </v-card>
    </v-container>

</template>

<script>

export default {
    name: 'CrearAgrupacion',

    data: () => ({
        searchQuery: '',
        searchResults: [],
        nombre_agr: '',
        descripcion: '',
        rutUsuario: '',
        verificado: 'Noverificado',
        fecha_verificacion: null,
        tags: [],
        rol: '',

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
        async login() {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: this.email }),
            });
        },
        async CreaAgrupacion(nombre_agr, descripcion, tags) {
            try {
                const rut = this.rutUsuario;
                const fecha_creacion = new Date();
                const verificado= this.verificado;
                console.log(rut)
                const response = await fetch('http://localhost:3000/agrupaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre_agr, descripcion, rut, fecha_creacion, verificado }),
                });
                
                // Verifica si la respuesta es exitosa
                if (response.ok) {
                    const data = await response.json();
                    // Llama a la función para registrar los tags
                    this.tags.forEach(tag => this.RegistrarTag(tag, data.id_agr));
                } else {
                    const error = await response.json();
                    console.error('Error en la respuesta:', error);
                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
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
                const response = await fetch(`http://localhost:3000/buscarTags/${stringValue}`);
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
        async RegistrarTag(nombre_tag, id_agr) {
            try {
                const { id_tag } = nombre_tag;
                const response = await fetch('http://localhost:3000/ingresartagsagrupacion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_tag, id_agr }),
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
        this.rutUsuario = this.getRut();
        this.rol = this.getRol();
    },
};

</script>