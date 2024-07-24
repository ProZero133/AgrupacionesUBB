<template>
    <v-container class="contenedorPrincipal">
        <v-container class="contenedor-datosUsuario">
            <v-card class="card-usuario">
                <v-row>
                    <!-- Columna de información del usuario -->
                    <v-col cols="8">
                        <v-card-title>
                            <div class="nombre-usuario">{{ userName }}</div>
                            <div>{{ rut }}</div>
                            <div>{{ correo }}</div>
                            <div>{{ carrera }}</div>
                        </v-card-title>
                        <v-card class="preferencias" flat> <!-- Añade flat para menos énfasis si deseas -->
                            <v-card-title class="preferencias-titulo">Preferencias</v-card-title>
                            <v-card-text class="preferencias-contenido">
                                <div class="res-preferencias" v-for="result in preferencias" :key="result.id">
                                    {{ result.nombre_tag }} <!-- Ajusta esta línea según la estructura de tus datos -->
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Columna de búsqueda y resultados, ahora dentro de un v-card adicional -->
                    <v-col cols="4">
                        <v-card class="search-container">
                            <v-card-title>Añadir Tags a las preferencias</v-card-title>
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
                        <v-btn color="primary" class="mt-3" @click="ConfirmarSeleccion">Confirmar Selección</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-container>
    </v-container>
</template>

<style scoped>
.contenedorPrincipal {
    display: flex;
    margin-top: 10vh;
}

.preferencias {
    display: flex;
    margin-top: 24vh;
    border: 2px solid rgba(0, 0, 0, 0.1);
    width: 20vw;
    height: 40vh;

}
.preferencias-titulo {
  margin-bottom: 0; /* Elimina el margen inferior del título */
}
.preferencias-contenido {
  margin-top: 2vh; /* Ajusta este valor según sea necesario para reducir el espacio */
}
.nombre-usuario {
    font-weight: bold;
    font-size: 1.2em;
    /* Ajusta el tamaño de la fuente según necesites */
}

.card-usuario {
    display: flex;
    margin-left: 10vw;
    border: 2px solid rgb(0, 0, 0);
    border-radius: 4px;
    height: 80vh;
    width: 110vh;
}

.search-container {
    width: 35vw;
    height: 40vh;
    border: 2px solid rgba(0, 0, 0, 0.1);
    /* Cambia el color del borde según prefieras */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Sombra ligera para resaltar */
    padding: 10px;
    /* Espaciado interno para no pegar el contenido al borde */
}

.results-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* Espacio entre elementos */
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
        userName: 'Sebastián Vallejos Constanzo',
        rut: '20.487.563-4',
        correo: 'sebastian.vallejos2001@alumnos.ubiobio.cl',
        carrera: 'Ingenieria Civil Informatica',

    }),
    methods: {
        async fetchSearchResults(searchValue) {
            // Convertir searchValue a cadena explícitamente
            const stringValue = searchValue.trim();
            if (stringValue === '') {
                this.searchResults = [];
                return;
            }
            try {
                console.log('Buscando:', stringValue);
                const response = await fetch(`http://localhost:3000/buscarTags/${stringValue}`);
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                const data = await response.json();
                console.log(data);
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
        async obtenerPreferencias() {
            try {
                const response = await fetch(`http://localhost:3000/obtenerPreferencias/${this.rut}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error en la respuesta de la red');
                const data = await response.json();
                this.preferencias = []; // Asegúrate de que preferencias esté vacío antes de asignar nuevos valores
                const tagsPromises = data.map(async (item) => {
                    const tagResponse = await fetch(`http://localhost:3000/obtenerTagPorId/${item.id_tag}`, {
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
                const response = await fetch(`http://localhost:3000/actualizarPreferencias/${this.rut}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ preferencias: idTags })
                });
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                console.log('Preferencias actualizadas');
                this.obtenerPreferencias();
            } catch (error) {
                console.error('Error al actualizar preferencias:', error);
            }
        }

    },
    mounted() {
        this.obtenerPreferencias();
    }

}


</script>