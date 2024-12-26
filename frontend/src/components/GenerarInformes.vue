<template>
    <v-toolbar color="primary">
        <template v-slot:extension>
            <v-tabs v-model="tab" grow>
                <v-tab v-if="rol === 'Admin'" prepend-icon="mdi-shield-account" value="Usuarios">Usuarios</v-tab>
                <v-tab prepend-icon="mdi-account-group" value="Actividades">Actividades</v-tab>
                <v-tab prepend-icon="mdi-account-multiple" value="Agrupaciones">Agrupaciones</v-tab>
            </v-tabs>
        </template>
    </v-toolbar>

    <v-tab-item value="Usuarios" v-if="tab === 'Usuarios'">
        <Usuarios />
    </v-tab-item>

    <v-tab-item value="Actividades" v-if="tab === 'Actividades'">
        <v-container class="containerActividades" grid-list-xs>

            <v-card class="ContenedorSelector" elevation="15">
                <v-card-title class="ContenedorTitulo">
                    <h1 class="Titulo" style="margin: 2%;">Generar Informe de Actividades</h1>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-select chips multiple v-model="selectedGrupos" :items="grupos" item-text="nombre_agr"
                                    elevation="24" item-value="id_agr" label="Seleccione un grupo" required></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12" lg="12" class="d-flex justify-end">
                                <v-btn elevation="24" icon="mdi-table-refresh" color="#014898" :disabled="isGenerating"
                                    @click="generarTabla()"></v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card-title>
            </v-card>
        </v-container>

        <v-spacer></v-spacer>

        <v-container>
            <v-card class="ContenedorInforme" elevation="24">
                <v-card-title class="ContenedorGrafico">
                    <h1 class="d-flex justify-start" style="margin: 2%;">Informe de actividades</h1>

                    <v-btn v-if="selectedGrupo" @click="menu = !menu" color="primary" text>
                        {{ selectedGrupo.nombre_agr }}
                    </v-btn>

                    <v-menu v-model="menu" :close-on-content-click="false" offset-y>
                        <v-list>
                            <v-list-item v-for="(grupo, index) in gruposUsuario" :key="index"
                                @click="selectGrupo(grupo)">
                                <v-list-item-title>{{ grupo.nombre_agr }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-card-text>
                        <v-data-table :headers="headersInformeAct" :items="contenidoPDF" :sort-by="['nom_act']"
                            :sort-desc="[false]">
                            <template v-slot:item.action="{ item }">
                                <div class="d-flex justify-end">

                                </div>
                            </template>
                        </v-data-table>
                        <v-col class="d-flex justify-end">
                            <v-btn elevation="24" icon="mdi-download" color="#014898" @click="generarPDFAct()"></v-btn>
                        </v-col>
                    </v-card-text>
                </v-card-title>
            </v-card>
        </v-container>

    </v-tab-item>

    <v-tab-item value="Agrupaciones" v-if="tab === 'Agrupaciones'">
        <Agrupaciones />
    </v-tab-item>





</template>

<script>
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import { id } from 'vuetify/lib/locale/index.mjs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
    name: 'GenerarInformes',
    data: () => ({
        rut: '',
        rol: '',
        // nombre grupos usuario
        grupos: [],

        // nombre grupos usuario seleccionados
        selectedGrupos: [],
        Actividades: ['Actividades'],
        actividades: [],
        publicaciones: [],
        votaciones: [],
        formularios: [],

        // nombre y id grupos usuario
        gruposConID: [],
        resultadoGrupos: [],

        // headers de la tabla de actividades
        headersInformeAct: [
            { title: 'Nombre evento', value: 'nom_act', sortable: true },
            { title: 'Visibilidad', value: 'tipo', sortable: true },
            { title: 'Fecha de realizacion', value: 'fecha_creacion', align: 'end', sortable: false },
            { title: 'Descripción', value: 'descripcion', sortable: false },
        ],

        // contenido de la tabla de agrupaciones
        headersAgrupaciones: [
            { text: 'Nombre', value: 'nombre_agr' },
            { text: 'Descripción', value: 'descripcion' },
            { text: 'Fecha de creación', value: 'fecha_creacion' },
            { text: 'Estado', value: 'estado' },
        ],


        contenidoPDF: [],
        datos: [],
        tab: 'Actividades',
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
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    this.grupos = data.map(grupo => grupo.nombre_agr);
                    // mapear los grupos con su id y nombre_agrcomo descargar un array a pdfc
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

        async obtenerActividadesGrupo() {
            try {
                //Para cada id_agr de gruposConID donde el nombre_agr de gruposConID este en selectedGrupos, obtener las actividades 
                this.resultadoGrupos = this.gruposConID.filter(grupo => this.selectedGrupos.includes(grupo.nombre_agr));
                //Obtiene las actividades de los grupos seleccionados si se selecciono la opcion de actividades
                if (this.Actividades.includes('Actividades')) {

                    // Asegúrate de acceder al primer elemento del array anidado
                    const grupos = this.resultadoGrupos;

                    if (grupos.length === 0) {
                        this.$root.showSnackBar('error', 'Agrupación no seleccionada!');
                        return;
                    }

                    // Hacer fetch para obtener las actividades de los grupos seleccionados con un bucle for a la lista de grupos seleccionados
                    for (let i = 0; i < grupos.length; i++) {
                        //Recorre la lista de gruposConID 
                        const response = await fetch(`${global.BACKEND_URL}/actividadesgrupo/${grupos[i].id_agr}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                            },
                        });
                        const data = await response.json();

                        if (response.ok) {
                            // Añade las actividades obtenidas a un arreglo
                            this.actividades = this.actividades.concat(data);

                        } else {
                            console.error('No se encontraron actividades: ', response.status);
                        }
                    }
                }

            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },


        async validarParticipacion() {
            try {
                for (let i = 0; i < this.actividades.length; i++) {

                    //Recorre la lista de gruposConID 
                    const response = await fetch(`${global.BACKEND_URL}/actividadesparticipante/${this.rut}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                        },
                    });
                    const data = await response.json();

                    if (response.ok) {

                        // compara los arrays de actividades y actividadesparticipante
                        this.actividades[i].success = data.some(item => item.id_act === this.actividades[i].id_act);

                    } else {
                        console.error('No se encontraron actividades: ', response.status);
                    }
                }

            } catch (error) {
                console.error('Error al hacer fetch:', error);
            }
        },



        // funcion para generar un pdf con los datos de contenidoPDF
        async generarPDFAct() {
            // Crea un nuevo documento PDF
            const doc = new jsPDF();

            // Asegúrate de que this.contenidoPDF sea un array
            if (Array.isArray(this.contenidoPDF)) {
                // Filtra los elementos que no son actividades válidas
                const contenidoValido = this.contenidoPDF.filter(item => item.success !== false);

                // Agrupa los elementos por nombre_agr
                const contenidoPorAgrupacion = contenidoValido.reduce((acc, item) => {
                    const grupo = this.gruposConID.find(grupo => grupo.id_agr === item.id_agr);
                    const nombreAgr = grupo ? grupo.nombre_agr : 'Sin Agrupación';
                    if (!acc[nombreAgr]) {
                        acc[nombreAgr] = [];
                    }
                    acc[nombreAgr].push(item);
                    return acc;
                }, {});

                // Genera una página para cada grupo
                Object.keys(contenidoPorAgrupacion).forEach((nombreAgr, index) => {
                    if (index > 0) {
                        doc.addPage();
                    }
                    const contenido = contenidoPorAgrupacion[nombreAgr];
                    const columnas = contenido.map(item => ({
                        'Nombre Actividad': item.nom_act,
                        'Visibilidad': item.tipo ? 'false' : 'true',
                        'Fecha': item.fecha_creacion,
                        'Descripción': item.descripcion,
                    }));

                    // Genera la página
                    doc.text(`Actividades de la agrupacion "${nombreAgr}"`, 10, 11);
                    doc.autoTable({
                        head: [['Nombre Actividad', 'Tipo', 'Fecha', 'Descripción']],
                        body: columnas.map(col => [col['Nombre Actividad'], col['Tipo'], col['Fecha'], col['Descripción']]),
                        columnStyles: {
                            0: { cellWidth: 40 }, // nombre act
                            1: { cellWidth: 20 }, // tipo
                            2: { cellWidth: 25 }, // fecha
                        },
                        styles: { overflow: 'linebreak' }, // Ajusta el texto que se desborda
                    });
                });

                // Guarda el archivo PDF
                doc.save('Informe_Agrupaciones_ConectaUBB.pdf');
            }
        },

        async generarTabla() {

            // vacia el array que contiene los datos que se muestran en la data table
            this.actividades = [];
            await this.obtenerActividadesGrupo();
            await this.validarParticipacion();
            this.contenidoPDF = this.actividades.flat();

            // si dentro del array el atributo "Aprobado" es false lo cambia por "Rechazado"
            this.contenidoPDF.forEach(item => {
                if (item.tipo === false) {
                    item.tipo = "Privada";
                } else {
                    item.tipo = "Publica";
                }
            });

            // cambia el formato de la fecha
            this.contenidoPDF.forEach(item => {
                item.fecha_creacion = new Date(item.fecha_creacion).toLocaleDateString();
            });

            // si la response es success: false elimina el item del array
            this.contenidoPDF = this.contenidoPDF.filter(item => item.success !== false);

            console.log("CONTENIDO DEL INFORME", this.contenidoPDF);

            return this.contenidoPDF;
        },

        async cambiarGrupo() {

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
.containerActividade {
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