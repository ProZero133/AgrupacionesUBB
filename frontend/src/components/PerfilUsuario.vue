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
                    <v-text-field v-model="searchQuery" @input="fetchSearchResults(searchQuery)" append-icon="mdi-plus"
                        append-icon-class="blue-background" @click:append="dialoTag = true" label="Buscar..."
                        single-line hide-details></v-text-field>
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
                <v-card class="mt-5">
                    <v-card-text>
                        <span style="opacity: 0.7;">
                            <h1>¿No encuentras el tag que estás buscando?</h1>
                        </span>
                        <v-btn text color="primary" @click="dialoTag = true" style="margin-top: 16px;">Presiona para crear el tuyo</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-card>





    <v-dialog v-model="dialoTag" max-width="290">
        <v-card>
            <v-card-title class="headline">Crear nuevo Tag</v-card-title>
            <v-card-text>
                <v-text-field v-model="tag" label="Nombre del tag"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialoTag = false">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="crearTag(tag)">Añadir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-spacer></v-spacer>
    <v-card class="footer-card" style="background-color: #014898;" dark>
        <v-container>
            <v-row justify="space-between" align="center">
                <!-- Logo -->
                <v-col cols="12" md="2">
                    <img src="@/assets/escudo-monocromatico-oscuro.png" alt="Logo" width="120" height="80" />
                </v-col>
                <v-col cols="12" md="2">
                    <img src="@/assets/ConectaUBB.png" alt="Logo" width="200" height="80" />
                </v-col>
                <!-- Información de contacto -->
                <v-col cols="12" md="4">
                    <div class="text-center" style="color: white;">
                        <p>Conectando agrupaciones y estudiantes de
                            la Universidad del Bío-Bío.
                        </p>
                        <p>Conecta UBB es una iniciativa estudiantil,
                            con apoyo de la Dirección de Desarrollo
                            Estudiantil.</p>
                    </div>
                </v-col>

                <!-- Redes sociales -->
                <v-col cols="12" md="4">
                    <div class="text-center">
                        <p style="color: white;">Si tienes dudas o consultas escríbenos a
                        </p>
                        <p style="color: white;">conectaubb@gmail.com
                        </p>
                        <p style="color: white;">Conéctate con las redes sociales de la DDE
                        </p>
                        <v-btn icon href="https://www.facebook.com/ddeconcepcion" target="_blank">
                            <v-icon>mdi-facebook</v-icon>
                        </v-btn>
                        <v-btn icon href="https://x.com/ddeubiobio" target="_blank">
                            <v-icon>mdi-twitter</v-icon>
                        </v-btn>
                        <v-btn icon href="https://www.instagram.com/ddeconcepcion/?hl=es" target="_blank">
                            <v-icon>mdi-instagram</v-icon>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
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

.blue-background {
    background-color: blue;
    border-radius: 50%;
    /* Para que el fondo sea redondo */
    padding: 5px;
    /* Espaciado dentro del fondo */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
    /* Cambiar el color del ícono a blanco */
}
</style>

<script>
import { useRouter } from 'vue-router';
import { no } from 'vuetify/lib/locale/index.mjs';

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
        dialoTag: false,

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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                });

                if (!response.ok) throw new Error('Error en la respuesta de la red');
                const data = await response.json();
                this.preferencias = []; // Asegúrate de que preferencias esté vacío antes de asignar nuevos valores
                const tagsPromises = data.map(async (item) => {
                    const tagResponse = await fetch(`${global.BACKEND_URL}/obtenerTagPorId/${item.id_tag}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                        },
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                });
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                this.obtenerPreferencias();
            } catch (error) {
                console.error('Error al eliminar preferencia:', error);
            }
        },
        async crearTag(nombre_tag) {
            try {
                const response = await fetch(`${global.BACKEND_URL}/tags`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                    body: JSON.stringify({ nombre_tag, rut: this.rut })
                });
                if (response.ok) {
                    this.$root.showSnackBar('success', 'Tag creado', 'Operación exitosa');
                    this.dialoTag = false;
                    const nuevoTag = await fetch(`${global.BACKEND_URL}/buscarTags/${nombre_tag}`);
                    if (!nuevoTag.ok) throw new Error('Error en la respuesta de la red');
                    const data = await nuevoTag.json();
                    await fetch(`${global.BACKEND_URL}/actualizarPreferencias/${this.rut}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                        },
                        body: JSON.stringify({ preferencias: [data[0].id_tag] })
                    });
                    this.obtenerPreferencias();
                    this.dialoTag = false;
                    this.fetchSearchResults(this.searchQuery);
                } else {
                    this.dialoTag = false;
                    throw new Error('Error en la respuesta de la red');
                }
            } catch (error) {
                console.error('Error al crear tag:', error);
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