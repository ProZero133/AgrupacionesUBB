<template>
    <v-container class="contenedorPrincipal" grid-list-xs>
        <v-btn v-if="selectedGrupo" @click="menu = !menu" color="primary" text>
                {{ selectedGrupo.nombre_agr }}
            </v-btn>
            <v-menu v-model="menu" :close-on-content-click="false" offset-y>
                <v-list >
                    <v-list-item v-for="(grupo, index) in gruposUsuario" :key="index" @click="selectGrupo(grupo)">
                        <v-list-item-title>{{ grupo.nombre_agr }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        <v-data-table v-model:expanded="expanded" :headers="dessertHeaders" :items="desserts" item-value="name"
            show-expand>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Historial</v-toolbar-title>
                </v-toolbar>
            </template>
            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        More info about {{ item.name }}
                    </td>
                </tr>
            </template>
        </v-data-table>

        <v-card>
            <v-card-title class="ContenedorTitulo">
                <h1 class="Titulo">Generar reporte historiales</h1>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-select chips multiple v-model="selectedGrupos" :items="grupos" item-text="nombre_agr"
                                item-value="id_agr" label="Seleccione un grupo" required></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-select multiple v-model="selectedTipos" :items="tipos"
                                label="Seleccione los eventos para los historiales" required></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-btn class="form-submit" type="submit" color="#2CA2DC" @click="generarReporte()">Generar
                                reporte</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card-title>


        </v-card>
    </v-container>
</template>

<script>
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import { id } from 'vuetify/lib/locale/index.mjs';
import * as XLSX from 'xlsx';
export default {
    name: 'GenerarInformes',
    data: () => ({
        rut: '',
        rol: '',
        gruposUsuario: [],
        selectedGrupos: [],
        selectedGrupo: null,
        menu: false,
    }),
    setup() {
        const router = useRouter();

        return {
            router,
        };
    },
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
        async obtenerGrupos() {
            try {
                const response = await fetch(`${global.BACKEND_URL}/obtenerGruposUsuario/${this.rut}`, {
                    method: 'GET',
                });
                const data = await response.json();

                if (response.status === 200) {
                    this.gruposUsuario = data;
                    this.selectedGrupo = this.gruposUsuario[0];
                    console.log('Grupo seleccionado:', this.selectedGrupo);
                } else {
                    console.error('No se encontraron agrupupaciones:', response.status);

                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },
        selectGrupo(grupo) {
            this.selectedGrupo = grupo;
            this.menu = false;
        },


    },
    mounted() {
        this.rut = this.getRut();
        this.rol = this.getRol();
        this.obtenerGrupos();
    }
}


</script>

<style scoped>
.contenedorPrincipal {
    margin-top: 10vh;
}

.Titulo {
    font-size: calc(1.5rem + 1vw);
    text-align: left;
    white-space: nowrap;
    overflow: visible;
    text-overflow: clip;
    flex-grow: 1;
    min-width: 0;
}
</style>