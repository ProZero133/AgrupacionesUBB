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
        // nombre grupos usuario
        grupos: [],
        tipos: ['Actividades', 'Publicaciones', 'Encuestas', 'Formularios'],
        // nombre grupos usuario seleccionados
        selectedGrupos: [],
        selectedTipos: [],
        actividades: [],
        publicaciones: [],
        encuestas: [],
        formularios: [],
        // nombre y id grupos usuario
        gruposConID: [],
        resultadoGrupos: [],
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
                    // mapear los grupos con su id y nombre_agr
                    this.gruposConID = data.map(grupo => ({
                        id_agr: grupo.id_agr,
                        nombre_agr: grupo.nombre_agr,
                    }));

                } else {
                    console.error('No se encontraron agrupupaciones:', response.status);
                }
            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },
        async obtenerGruposPorNombre() {
            try {
                //Para cada id_agr de gruposConID donde el nombre_agr de gruposConID este en selectedGrupos, obtener las actividades 
                this.resultadoGrupos = this.gruposConID.filter(grupo => this.selectedGrupos.includes(grupo.nombre_agr));
                //Obtiene las actividades de los grupos seleccionados si se selecciono la opcion de actividades
                if (this.selectedTipos.includes('Actividades')) {
                    // Asegúrate de acceder al primer elemento del array anidado
                    const grupos = this.resultadoGrupos;
                    // Hacer fetch para obtener las actividades de los grupos seleccionados con un bucle for a la lista de grupos seleccionados
                    for (let i = 0; i < grupos.length; i++) {
                        //Recorre la lista de gruposConID 
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
            // Asegúrate de que this.actividades sea un array
            if (!Array.isArray(this.actividades)) {
                console.error('actividades no es un array:', this.actividades);
                return;
            }

            // Filtra los elementos que no son arrays de arrays
            const actividades = this.actividades.filter(Array.isArray).flat();

            // Filtra los elementos que no son actividades válidas
            const actividadesValidas = actividades.filter(actividad => actividad.success !== false);

            if (actividadesValidas.length === 0) {
                console.error('No se encontraron actividades válidas:', actividades);
                return;
            }

            console.log("Actividades: ", actividadesValidas);

            // Agrupa las actividades por id_agr
            const actividadesPorAgrupacion = actividadesValidas.reduce((acc, actividad) => {
                const idAgr = actividad.id_agr;
                if (!acc[idAgr]) {
                    acc[idAgr] = [];
                }
                acc[idAgr].push(actividad);
                return acc;
            }, {});

            // Crea un nuevo libro de Excel
            const wb = XLSX.utils.book_new();

            // Genera una hoja de cálculo para cada grupo de actividades
            Object.keys(actividadesPorAgrupacion).forEach(idAgr => {
                const actividades = actividadesPorAgrupacion[idAgr];
                const columnas = actividades.map(actividad => ({
                    'Nombre Actividad': actividad.nom_act,
                    'Descripción': actividad.descripcion,
                    'Tipo': actividad.tipo ? 'Tipo 1' : 'Tipo 2', // Ajusta según tu lógica
                    // Agrega más columnas según sea necesario
                }));

                // Genera la hoja de cálculo
                const ws = XLSX.utils.json_to_sheet(columnas);
                XLSX.utils.book_append_sheet(wb, ws, `Agrupación ${idAgr}`);
            });

            // Escribe el archivo Excel
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