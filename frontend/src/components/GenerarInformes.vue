<template>
    <v-container class="contenedorPrincipal" grid-list-xs>

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
        grupos: [],
        resultadoGrupos: [],
        tipos: ['Actividades', 'Publicaciones', 'Encuestas', 'Formularios'],
        selectedGrupos: [],
        selectedTipos: [],
        actividades: [],
        publicaciones: [],
        encuestas: [],
        formularios: [],
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

                if (response.ok) {
                    this.grupos = data.map(grupo => grupo.nombre_agr);
                } else {
                    console.error('No se encontraron agrupupaciones:', response.status);
                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },
        async obtenerGruposPorNombre() {
            try {
                //Hacer fetch para obtener los grupos por nombre con un bucle for a la lista de grupos seleccionados
                for (let i = 0; i < this.selectedGrupos.length; i++) {
                    console.log("Buscando grupo: ", this.selectedGrupos[i]);
                    const response = await fetch(`${global.BACKEND_URL}/agrupacionesNombre/${this.selectedGrupos[i]}`, {
                        method: 'GET',
                    });
                    const data = await response.json();

                    if (response.ok) {
                        //Añade los grupos obtenidos a un arreglo
                        this.resultadoGrupos.push(data);
                    } else {
                        console.error('No se encontraron agrupupaciones:', response.status);
                    }
                }
                //Obtiene las actividades de los grupos seleccionados si se selecciono la opcion de actividades
                if (this.selectedTipos.includes('Actividades')) {
                    // Asegúrate de acceder al primer elemento del array anidado
                    const grupos = this.resultadoGrupos[0];
                    // Hacer fetch para obtener las actividades de los grupos seleccionados con un bucle for a la lista de grupos seleccionados
                    for (let i = 0; i < grupos.length; i++) {
                        const response = await fetch(`${global.BACKEND_URL}/actividadesgrupo/${grupos[i].id_agr}`, {
                            method: 'GET',
                        });
                        const data = await response.json();

                        if (response.ok) {
                            // Añade las actividades obtenidas a un arreglo
                            this.actividades.push(data);
                            console.log("Actividades: ", this.actividades);
                        } else {
                            console.error('No se encontraron actividades:', response.status);
                        }
                    }
                }
                //Obtiene las publicaciones de los grupos seleccionados si se selecciono la opcion de publicaciones
                if (this.selectedTipos.includes('Publicaciones') || this.selectedTipos.includes('Votaciones') || this.selectedTipos.includes('Formularios')) {
                    // Hacer fetch para obtener las publicaciones de los grupos seleccionados con un bucle for a la lista de grupos seleccionados
                    for (let i = 0; i < this.resultadoGrupos.length; i++) {
                        const response = await fetch(`${global.BACKEND_URL}/publicacionesgrupo/${this.resultadoGrupos[i].id_agr}`, {
                            method: 'GET',
                        });
                        const data = await response.json();

                        if (response.ok) {
                            // Procesar el arreglo data según el tipoPub
                            if (this.selectedTipos.includes('Publicaciones')) {
                                data.forEach(item => {
                                    if (item.tipoPub === 'publicacion') {
                                        this.publicaciones.push(item);
                                    }
                                });
                            }
                            if (this.selectedTipos.includes('Votaciones')) {
                                data.forEach(item => {
                                    if (item.tipoPub === 'votacion') {
                                        this.votaciones.push(item);
                                    }
                                });
                            }
                            if (this.selectedTipos.includes('Formularios')) {
                                data.forEach(item => {
                                    if (item.tipoPub === 'formulario') {
                                        this.formularios.push(item);
                                    }
                                });
                            }
                        } else {
                            console.error('No se encontraron publicaciones:', response.status);
                        }
                    }
                }




            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },
        generarExcelActividades() {
            // Asegúrate de acceder al primer elemento del array anidado
            const actividades = this.actividades[0];

            // Define las columnas que deseas incluir en el archivo Excel
            const columnas = actividades.map(actividad => ({
                'Nombre Actividad': actividad.nom_act,
                'Descripción': actividad.descripcion,
                'Tipo': actividad.tipo ? 'Tipo 1' : 'Tipo 2', // Ajusta según tu lógica
                'ID Agrupación': actividad.id_agr,
                // Agrega más columnas según sea necesario
            }));

            // Genera la hoja de cálculo
            const ws = XLSX.utils.json_to_sheet(columnas);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Actividades');
            XLSX.writeFile(wb, 'actividades.xlsx');
        },
        async generarReporte() {
            await this.obtenerGruposPorNombre(); // Espera a que la función asíncrona se complete
            if (this.selectedTipos.includes('Actividades')) {
                this.generarExcelActividades();
            }
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