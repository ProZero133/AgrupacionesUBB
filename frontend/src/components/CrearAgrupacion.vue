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

                    <v-col cols="12" md="7" class="nomdes">

                        <v-col cols="12">
                            <v-text-field v-model="nombre_agr" label="Nombre de la agrupación" clearable required
                                variant="solo-filled" :rules="nombreRules"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea class="descripcionAct" v-model="descripcion"
                                label="Descripción de la agrupación" clearable required variant="solo-filled" rows="10"
                                no-resize :rules="descrules" counter>
                            </v-textarea>
                        </v-col>

                    </v-col>

                    <v-col cols="12" md="5">

                        <v-col cols="12">
                            <v-file-input v-model="imagen" accept="image/png, image/jpeg, image/bmp"
                                label="Imagen para la agrupación" clearable required variant="solo-filled"
                                prepend-icon="" :rules="imgRules" @change="onFileChange($event)"
                                @click:clear="urlImagen = defaultImageUrl">
                            </v-file-input>
                        </v-col>

                        <v-col>
                            <v-img class="image" max-height="280px" aspect-ratio="1" :src='urlImagen'
                                :rules="imgRules" />
                        </v-col>

                    </v-col>

                    <v-col cols="12">
                        <v-card class="search-container">
                            <v-card-title>Añadir Tags a la Agrupación</v-card-title>
                            <v-text-field v-model="searchQuery" @input="fetchSearchResults(searchQuery)"
                                append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
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
                                    <v-chip class="selected-item" v-for="item in tags" :key="item.id"
                                        @click="eliminarTag(item)">
                                        {{ item.nombre_tag }}
                                    </v-chip>
                                </v-chip-group>
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
import addImage from '../assets/imagePlaceholder.png';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
    },
    name: 'CrearAgrupacion',

    data: () => ({
        descrules: [
            v => !!v || 'Descripción requerida.',
            v => v.length <= 500 || 'Máximo 500 caracteres.'
        ],
        nombreRules: [
            v => !!v || 'Nombre de la actividad requerido.',
            v => v.length <= 50 || 'Máximo 50 caracteres.'
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

        searchQuery: '',
        searchResults: [],
        nombre_agr: '',
        descripcion: '',
        rutUsuario: '',
        tags: [],
        rol: '',

        imagen: [],
        defaultImageUrl: addImage,
        urlImagen: addImage,
        idImagen: '',
    }),
    methods: {
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
        async eliminarTag(item) {
            this.tags = this.tags.filter(tag => tag.id !== item.id);
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

        async CreaAgrupacion(nombre_agr, descripcion, tags) {
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

            try {
                const rut = this.rutUsuario;
                const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                    body: JSON.stringify({ nombre_agr, descripcion, rut, imagen: this.idImagen }),
                });

                // Verifica si la respuesta es exitosa
                if (response.ok) {
                    const data = await response.json();
                    this.$root.showSnackBar('success', 'Agrupación creada con éxito!');
                    this.$router.push(`/api/grupo/${data.id_agr}`);
                    // Llama a la función para registrar los tags
                    this.tags.forEach(tag => this.RegistrarTag(tag.id_tag, data.id_agr));
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
        async RegistrarTag(id_tag, id_agr) {
            try {
                const response = await fetch(`${global.BACKEND_URL}/ingresartagsagrupacion`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                    body: JSON.stringify({ id_tag: id_tag, id_agr: id_agr }),
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

<style>
.descripcionAct {
    height: 20px !important;
    margin-top: -20px;
    margin-bottom: 230px;
}

.image {
    margin-top: -20px;
    margin-bottom: -20px;
}

.selected-items-container {
    height: 200px;
}
</style>