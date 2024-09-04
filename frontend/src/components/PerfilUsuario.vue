<template>
    <v-card class="card-usuario pa-4">
        <v-row>
            <!-- Columna de información del usuario -->
            <v-col cols="12" md="6" class="user-info">
                <v-card-title class="pa-0">
                    <div class="nombre-usuario">{{ userName }}</div>
                    <div>{{ rut }}</div>
                    <div>{{ correo }}</div>
                    <div>{{ carrera }}</div>
                </v-card-title>
                <v-card class="preferencias pa-3" flat>
                    <v-card-title class="preferencias-titulo pa-0">Preferencias</v-card-title>
                    <v-card-text class="preferencias-contenido pa-0">
                        <v-chip-group>
                            <v-chip v-for="result in preferencias" :key="result.id" class="res-preferencias"
                                color="primary" text-color="white" outlined @click="eliminarPreferencia(result)">
                                {{ result.nombre_tag }}
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Columna de búsqueda y resultados -->
            <v-col cols="12" md="6">
                <v-card class="search-container pa-3 mb-3">
                    <v-card-title class="pa-0">Añadir Tags a las preferencias</v-card-title>
                    <v-text-field v-model="searchQuery" @input="fetchSearchResults(searchQuery)"
                        append-icon="mdi-magnify" label="Buscar..." single-line hide-details></v-text-field>
                    <v-card-text class="pa-0">
                        <v-chip-group>
                            <v-chip v-for="item in searchResults" :key="item.id" @click="selectItem(item)"
                                class="result-item" color="primary" text-color="white" outlined>
                                {{ item.nombre_tag }}
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-card>
                <v-card class="selected-items-container pa-3 mb-3">
                    <v-card-title class="pa-0">Tags seleccionados</v-card-title>
                    <v-card-text class="pa-0">
                        <v-chip-group>
                            <v-chip v-for="item in selectedItems" :key="item.id" class="selected-item" color="primary"
                                text-color="white" @click="eliminarTag(item)">
                                {{ item.nombre_tag }}
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-card>
                <v-btn color="primary" class="mt-2" @click="ConfirmarSeleccion">Confirmar Selección</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<style scoped>
.card-usuario {
    margin-top: 15vh;
    max-width: 80vw;
    min-width: 395px;
 
}

.nombre-usuario {
    font-weight: bold;
}

.user-info {
    margin-bottom: 20px;
}

.pa-4 {
    padding: 16px !important;
}

.mb-3 {
    margin-bottom: 16px !important;
}

.mt-2 {
    margin-top: 8px !important;
}
</style>

<script>
import { useRouter } from 'vue-router';

export default {
    name: 'PerfilUsuario',
    data: () => ({
        searchQuery: '',
        searchResults: [],
        preferencias: [],
        selectedItems: [],
        userName: '',
        rut: '',
        correo: '',
        carrera: '',

    }),
    methods: {
        getNombre() {
            const token = this.$cookies.get('token');
            if (token) {
                try {
                    const tokenParts = token.split('&');
                    tokenParts[1] = tokenParts[1].replace('nombre=', '');
                    return tokenParts[1];
                } catch (error) {
                    console.error('Invalid token:', error);
                }
            }
            return null;
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
        getCorreo() {
            const token = this.$cookies.get('token');
            if (token) {
                try {
                    const tokenParts = token.split('&');
                    tokenParts[3] = tokenParts[3].replace('email=', '');
                    return tokenParts[3];
                } catch (error) {
                    console.error('Invalid token:', error);
                }
            }
            return null;
        },
        getCarrera() {
            const token = this.$cookies.get('token');
            if (token) {
                try {
                    const tokenParts = token.split('&');
                    tokenParts[4] = tokenParts[4].replace('carrera=', '');
                    return tokenParts[4];
                } catch (error) {
                    console.error('Invalid token:', error);
                }
            }
            return null;
        },
        async fetchSearchResults(searchValue) {
            // Convertir searchValue a cadena explícitamente
            const stringValue = searchValue.trim();
            if (stringValue === '') {
                this.searchResults = [];
                return;
            }
            try {
                const response = await fetch(`${global.BACKEND_URL}/buscarTags/${stringValue}`);
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                const data = await response.json();
                this.searchResults = data; // Asegúrate de que esto coincida con el formato de tu respuesta
            } catch (error) {
                console.error('Error al buscar:', error);
                this.searchResults = [];
            }
        },
        selectItem(item) {
            this.selectedItems.push(item); // Añade el item a la lista de seleccionados
            this.searchResults = this.searchResults.filter(i => i.id !== item.id); // Elimina el item de `searchResults`
        },
        async eliminarTag(item) {
            this.selectedItems = this.selectedItems.filter(tag => tag.id !== item.id);
        },
        async obtenerPreferencias() {
            try {
                const response = await fetch(`${global.BACKEND_URL}/obtenerPreferencias/${this.rut}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error en la respuesta de la red');
                const data = await response.json();
                this.preferencias = []; // Asegúrate de que preferencias esté vacío antes de asignar nuevos valores
                const tagsPromises = data.map(async (item) => {
                    const tagResponse = await fetch(`${global.BACKEND_URL}/obtenerTagPorId/${item.id_tag}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!tagResponse.ok) throw new Error('Error al obtener tag por ID');
                    const tagData = await tagResponse.json();
                    return tagData[0]; // Asume que siempre hay al menos un elemento y toma el primero
                });
                const tags = await Promise.all(tagsPromises);
                this.preferencias = tags; // Asigna el resultado a preferencias

            } catch (error) {
                console.error('Error al obtener preferencias:', error);
            }
        },
        async ConfirmarSeleccion() {
            try {
                const idTags = this.selectedItems.map(item => item.id_tag); // Suponiendo que cada item tiene un campo id_tag
                const response = await fetch(`${global.BACKEND_URL}/actualizarPreferencias/${this.rut}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ preferencias: idTags })
                });
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                this.obtenerPreferencias();
            } catch (error) {
                console.error('Error al actualizar preferencias:', error);
            }
        },
        async eliminarPreferencia(item) {
            try {
                const response = await fetch(`${global.BACKEND_URL}/eliminarPreferencia/${this.rut}/${item.id_tag}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                this.obtenerPreferencias();
            } catch (error) {
                console.error('Error al eliminar preferencia:', error);
            }
        }

    },
    mounted() {
        this.userName = this.getNombre();
        this.rut = this.getRut();
        this.correo = this.getCorreo();
        this.carrera = this.getCarrera();
        this.obtenerPreferencias();
    },

}


</script>