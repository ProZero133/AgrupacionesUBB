<template>
    <v-toolbar color="#014898">
        <template v-slot:extension>
            <v-tabs v-model="tab" grow>
                <v-tab v-if="rol === 'Admin'" prepend-icon="mdi-shield-account" value="Usuarios">Usuarios</v-tab>
                <v-tab prepend-icon="mdi-account-group" value="Actividades">Actividades</v-tab>
                <v-tab prepend-icon="mdi-account-multiple" value="Agrupaciones">Agrupaciones</v-tab>
            </v-tabs>
        </template>
    </v-toolbar>

    <!-------------------- TAB USUARIOS -------------------------->
    <v-tab-item value="Usuarios" v-if="tab === 'Usuarios'">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-title style="font-size: 1.5rem; font-weight: bold;">Ingrese el correo de un usuario</v-title>
                    <v-text-field label="Ingrese nombre.apellido" v-model="valorTextBoxUsuario"
                        @keyup.enter="valorTextBoxUsuario.length >= 4 ? substringUsuarioBDD() : $root.showSnackBar('error', 'Ingrese minimo 4 caracteres')"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-data-table :headers="headersBuscadorUsuario" :items="usuariosBuscados" class="elevation-15"
                    @click:row="abrirUsuarioSeleccionado">
                    <template v-slot:item.correo="{ item }">
                        <v-chip color="primary" dark>{{ item.correo }}</v-chip>
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-btn color="#014898" @click="abrirDialogUsuario(item)">Ver detalles</v-btn>
                    </template>
                </v-data-table>
            </v-row>
        </v-container>
    </v-tab-item>

    <v-dialog v-if="dialogUsuario == true" v-model="dialogUsuario" max-width="800px">
        <v-card>
            <v-row>
                <v-card-title>
                    {{ selectedUsuario.nombres }} {{ selectedUsuario.primer_apellido }}
                    {{ selectedUsuario.segundo_apellido }}
                </v-card-title>
                <v-card-title>
                    Agrupaciones a las que pertenece el usuario
                </v-card-title>
                <v-data-table :headers="headersAgrupacionesUsuario" :items="AgrupacionesPertenenciaUsuario"
                    :sort-desc="[false]" class="elevation-13" style="margin: 3%;">
                    <template v-slot:item.nombre_agr="{ item }">
                        <div style="width: 100%;">
                            {{ item.nombre_agr }}
                        </div>
                    </template>
                </v-data-table>

                <v-divider></v-divider>
                <v-spacer style="height: 20px;"></v-spacer>

                <v-card-title>
                    Actividades en las que participo el usuario seleccionado
                </v-card-title>
                <v-data-table :headers="headersActividadesUsuario" :items="ActividadesParticipaUsuario"
                    :sort-desc="[false]" class="elevation-13" style="margin: 3%;">
                    <template v-slot:item.nom_act="{ item }">
                        <div style="width: 100%;">
                            {{ item.nom_act }}
                        </div>
                    </template>
                    <template v-slot:item.fecha_creacion="{ item }">
                        <div style="width: 100%;">
                            {{ item.fecha_creacion }}
                        </div>
                    </template>
                    <template v-slot:item.descripcion="{ item }">
                        <div style="width: 400px;">
                            {{ item.descripcion }}
                        </div>
                    </template>

                </v-data-table>
                <v-row class="d-flex justify-end" style="margin: 3%;">
                    <v-btn elevation="24" icon="mdi-download" color="#014898"
                        @click="descargarInformeUsuario()"></v-btn>
                </v-row>
            </v-row>
        </v-card>
    </v-dialog>

    <!------------------------------------------------------------>



    <!-------------------- TAB ACTIVIDADES ----------------------->
    <v-tab-item value="Actividades" v-if="tab === 'Actividades'">
        <v-container class="containerActividades" grid-list-xs>
            <v-card class="ContenedorSelector" elevation="15">
                <v-card-title class="ContenedorTitulo">
                    <h1 class="Titulo" style="margin: 2%;">Informe de Actividades </h1>
                    <v-card-text>

                        <v-text-field v-model="AgrupacionBuscada" label="Ingrese el nombre de una agrupación"
                            prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>

                        <v-data-table :headers="headersAgrupacionesSeleccionadas" :items="gruposConID"
                            class="elevation-5" :items-per-page="5" :search="AgrupacionBuscada" show-select
                            item-value="id_agr" v-model="selectedGrupos">
                            <template v-slot:item.nombre_agr="{ item }">
                                <div
                                    style="max-width: 300px; white-space: wrap; overflow: hidden; text-overflow: ellipsis;">
                                    {{ item.nombre_agr }}
                                </div>
                            </template>
                            <template v-slot:item.verificado="{ item }">
                                <v-chip
                                    :color="item.visible === false ? 'red' : (item.verificado === 'Noverificado' ? 'orange' : 'green')"
                                    dark>
                                    {{ item.visible === false ? 'Invisible' : (item.verificado === 'Noverificado' ? 'No verificado' : item.verificado) }}
                                </v-chip>
                            </template>
                        </v-data-table>

                        <v-alert v-if="this.rol === 'Estudiante'" type="warning"
                            style="font-size: 19px; margin: 2%; white-space: normal; text-align: justify;">
                            Estos informes solo contienen las agrupaciones en las que participas. Si deseas recibir un
                            informe completo de tus agrupaciones puede acercarce a Direccion de Desarrollo Estudiantil
                            para
                            solicitarlas
                        </v-alert>
                        <v-row>
                            <v-col cols="12" sm="12" md="12" lg="12" class="d-flex justify-end">
                                <v-btn elevation="24" icon="mdi-table-refresh" color="#014898" :disabled="isGenerating"
                                    style="margin: 2%;" @click="generarTabla()"></v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card-title>
            </v-card>
        </v-container>

        <v-spacer></v-spacer>

        <v-container class="containerHistorialActividades" grid-list-xs>
            <v-card class="ContenedorInforme" elevation="24">
                <v-card-title class="ContenedorGrafico">
                    <h2 class="d-flex justify-start" style="margin: 2%;">Informe de participacion en actividades</h2>

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
    <!------------------------------------------------------------>



    <!-------------------- TAB AGRUPACIONES ---------------------->
    <v-tab-item value="Agrupaciones" v-if="tab === 'Agrupaciones'">
        <v-container class="containerActividades" grid-list-xs>
            <v-card class="ContenedorSelector" elevation="15">
                <v-card-title class="ContenedorTitulo">
                    <h1 class="Titulo" style="margin: 2%; text-align: center;">Generar informe de agrupaciones</h1>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12" lg="12" class="d-flex justify-center">
                                <v-btn elevation="24" class="form-submit" type="submit" color="#014898"
                                    :disabled="isGenerating" @click="generarInformeAgrupaciones(this.rut)">Generar
                                    Informe</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card-title>
            </v-card>
        </v-container>
    </v-tab-item>
    <!------------------------------------------------------------>
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

<script>
import { useRouter } from 'vue-router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
    name: 'GenerarInformes',
    data: () => ({
        rut: '',
        rol: '',
        tab: 'Actividades',
        // variables tab Usuarios
        // valorTextBoxUsuario
        valorTextBoxUsuario: '',
        UsuariosRegistrados: [],
        SubstringCorreo: [],
        usuariosBuscados: [],
        nombresAgrupaciones: [],
        selectedUsuario: [],
        DatosGrupo: [],
        dialogUsuario: false,

        // datos de la tabla de usuarios
        headersBuscadorUsuario: [
            { title: 'Nombres', value: 'nombres' },
            { title: 'Primer Apellido', value: 'primer_apellido' },
            { title: 'Segundo Apellido', value: 'segundo_apellido' },
            { title: 'Correo', value: 'correo' },
            { title: 'Rol', value: 'rol' },
            { value: 'action', align: 'center' },
        ],

        headersAgrupacionesUsuario: [
            { title: 'Nombre de la agrupación', value: 'nombre_agr' },
            { title: 'Fecha de integración', value: 'fecha_integracion' },
            { title: 'Rol interno', value: 'rol_agr' },
        ],

        headersActividadesUsuario: [
            { title: 'Nombre de la actividad', value: 'nom_act', width: '50%' },
            { title: 'Fecha de creación', value: 'fecha_creacion' },
            { title: 'Descripción', value: 'descripcion' },
        ],

        AgrupacionesPertenenciaUsuario: [],
        ActividadesParticipaUsuario: [],

        // variables tab Actividades
        // nombre grupos usuario seleccionados
        selectedGrupos: [],
        Actividades: ['Actividades'],
        actividades: [],
        publicaciones: [],
        formularios: [],
        gruposSinActividades: [],
        AgrupacionBuscada: '',

        // headers de la tabla de agrupaciones
        headersAgrupacionesSeleccionadas: [
            { title: 'Nombre de la agrupación', value: 'nombre_agr', sortable: true },
            { title: 'Estado de la agrupación', value: 'verificado', sortable: true },
        ],

        // headers de la tabla de actividades
        headersInformeAct: [
            { title: 'Nombre evento', value: 'nom_act', sortable: true },
            { title: 'Visibilidad', value: 'tipo', sortable: true },
            { title: 'Fecha de realizacion', value: 'fecha_creacion', align: 'end', sortable: false },
            { title: 'Descripción', value: 'descripcion', sortable: false },
        ],

        // variables tab Agrupaciones
        // nombre y id grupos usuario
        gruposConID: [],
        resultadoGrupos: [],
        cambioIDGrupo: [],

        // contenido de la tabla de agrupaciones
        headersAgrupaciones: [
            { title: 'Nombre', value: 'nombre_agr' },
            { title: 'Descripción', value: 'descripcion' },
            { title: 'Fecha de creación', value: 'fecha_creacion' },
            { title: 'Estado', value: 'estado' },
        ],

        // nombre grupos usuario
        grupos: [],

        // PDF
        contenidoPDF: [],
        datos: [],

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
                let DatosGrupo = this.gruposConID;
                if (this.rol === "Admin") {
                    const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                        },
                    });

                    const datos = await response.json();
                    const data = datos.data;

                    this.gruposConID = data;
                    if (datos.success === true) {
                        this.grupos = data.map(grupo => grupo.nombre_agr);
                        DatosGrupo = data.map((grupo, index) => ({
                            id_agr: grupo.id_agr,
                            nombre_agr: grupo.nombre_agr,
                        }));

                    } else {
                        this.gruposConID = [];
                        console.error('No se encontraron agrupaciones:', response.status);
                    }

                } else {
                    const response = await fetch(`${global.BACKEND_URL}/obtenerGruposUsuario/${this.rut}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                        },
                    });
                    const data = await response.json();
                    this.gruposConID = data;

                    if (response.ok) {
                        this.grupos = data.map(grupo => grupo.nombre_agr);

                        // mapear los grupos con su id y nombre_agr
                        DatosGrupo = data.map(grupo => ({
                            id_agr: grupo.id_agr,
                            nombre_agr: grupo.nombre_agr,
                        }));
                    } else {
                        console.error('No se encontraron agrupupaciones:', response.status);
                    }
                }
            } catch (error) {
                this.$root.showSnackBar('error', 'No se encontraron agrupaciones');
                console.error('Error al hacer fetch:', error);
            }
        },

        // USUARIOS

        async substringUsuarioBDD() {
            // llama a la api
            const response = await fetch(`${global.BACKEND_URL}/correoSubString`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
                body: JSON.stringify({
                    correo: this.valorTextBoxUsuario,
                }),
            });

            if (response.ok) {
                this.usuariosBuscados = [];
                this.usuariosBuscados = await response.json();
            } else {
                console.error('No se encontraron usuarios:', response.status);
            }
        },

        async generarInformeUsuario(rut) {
            // se obtienen las agrupaciones del usuario
            const responseAgrupaciones = await fetch(`${global.BACKEND_URL}/agrupacionesPertenece/${rut}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
            });
            if (responseAgrupaciones.ok) {
                this.AgrupacionesPertenenciaUsuario = await responseAgrupaciones.json();
                const GruposID = this.gruposConID;

                // formatea la fecha
                this.AgrupacionesPertenenciaUsuario.forEach(item => {
                    item.fecha_integracion = new Date(item.fecha_integracion).toLocaleDateString();
                });

                // añade un campo al array con el nombre de la agrupacion
                this.AgrupacionesPertenenciaUsuario.forEach(item => {
                    item.nombre_agr = GruposID.find(grupo => grupo.id_agr === item.id_agr).nombre_agr;
                });

                // busca las actividades en las que participo el usuario
                const responseActividades = await fetch(`${global.BACKEND_URL}/actividadesparticipante/${rut}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                });
                if (responseActividades.ok) {
                    this.ActividadesParticipaUsuario = await responseActividades.json();

                    // formatea la fecha
                    this.ActividadesParticipaUsuario.forEach(item => {
                        item.fecha_creacion = new Date(item.fecha_creacion).toLocaleDateString();
                    });

                } else {
                    console.error('No se encontraron actividades:', responseActividades.status);
                }
            } else {
                this.$root.showSnackBar('error', 'Este usuario no pertenece a ninguna agrupación');
            }
        },

        async descargarInformeUsuario() {
            const agrupaciones = this.AgrupacionesPertenenciaUsuario;
            const actividades = this.ActividadesParticipaUsuario;
            const fechaActual = new Date().toLocaleDateString();

            const doc = new jsPDF();

            doc.setFontSize(14);
            doc.text('INFORME DE PERTENENCIA DE AGRUPACIONES', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
            doc.setFontSize(11);
            doc.text(`${this.selectedUsuario.nombres} ${this.selectedUsuario.primer_apellido} ${this.selectedUsuario.segundo_apellido}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
            doc.text(`${fechaActual}`, doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });

            // Tabla de agrupaciones
            doc.autoTable({
                head: [['Nombre de la Agrupación', 'Fecha de Integración', 'Rol Interno']],
                body: agrupaciones.map(item => [item.nombre_agr, item.fecha_integracion, item.rol_agr]),
                startY: 40,
            });

            // Tabla de actividades por agrupación
            if (actividades.length > 0) {
                const agrupacionesMap = new Map();

                actividades.forEach(act => {
                    if (!agrupacionesMap.has(act.id_agr)) {
                        agrupacionesMap.set(act.id_agr, []);
                    }
                    agrupacionesMap.get(act.id_agr).push(act);
                });

                agrupacionesMap.forEach((acts, id_agr) => {
                    doc.addPage();

                    doc.setFontSize(14);
                    const nombreAgrupacion = this.gruposConID.find(grupo => grupo.id_agr === id_agr).nombre_agr;
                    doc.text('INFORME DE ACTIVIDADES', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
                    doc.text(`"${nombreAgrupacion}"`, doc.internal.pageSize.getWidth() / 2, 28, { maxWidth: 180, align: 'center', fontStyle: 'bold' });
                    doc.autoTable({
                        head: [['Nombre Actividad', 'Fecha', 'Descripción']],
                        body: acts.map(act => [act.nom_act, new Date(act.fecha_creacion).toLocaleDateString(), act.descripcion]),
                        columnStyles: {
                            0: { cellWidth: 50 }, // nombre act
                            1: { cellWidth: 30 }, // fecha
                        },
                        startY: 40,
                    });
                });

                // Guardar el PDF
                const nombreUsuario = `${this.selectedUsuario.nombres} ${this.selectedUsuario.primer_apellido} ${this.selectedUsuario.segundo_apellido}`;
                doc.save(`Informe_Agrupaciones_Actividades_${nombreUsuario}.pdf`);
            } else {
                const doc = new jsPDF();

                // Título del informe
                doc.text(`Nombre del Usuario: ${this.selectedUsuario.nombres} ${this.selectedUsuario.primer_apellido} ${this.selectedUsuario.segundo_apellido}`, 10, 20);

                // Tabla de agrupaciones
                doc.autoTable({
                    head: [['Nombre de la Agrupación', 'Fecha de Integración', 'Rol Interno']],
                    body: agrupaciones.map(item => [item.nombre_agr, item.fecha_integracion, item.rol_agr]),
                    startY: 40,
                });

                // Guardar el PDF
                const nombreUsuario = `${this.selectedUsuario.nombres} ${this.selectedUsuario.primer_apellido} ${this.selectedUsuario.segundo_apellido}`;
                doc.save(`Informe_Agrupaciones_${nombreUsuario}.pdf`);

                this.$root.showSnackBar('error', 'Este usuario no ha participado en ninguna actividad');
            }
        },

        async abrirDialogUsuario(usuario) {
            this.selectedUsuario = usuario;
            await this.generarInformeUsuario(usuario.rut);
            this.dialogUsuario = true;
        },

        // ACTIVIDADES
        añadirAgrupacion(item) {
            const index = this.selectedGrupos.indexOf(item);
            if (index === -1) {
                this.selectedGrupos.push(item);
            } else {
                this.selectedGrupos.splice(index, 1);
            }
            return this.selectedGrupos;
        },

        async obtenerActividadesGrupo() {
            try {
                //recorre this.gruposConID y si el id_agr de gruposConID esta en selectedGrupos, añade el valor completo a resultadoGrupos
                this.resultadoGrupos = this.gruposConID.filter(grupo => this.selectedGrupos.includes(grupo.id_agr));

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
                        } else if (response.status === 404) {
                            this.gruposSinActividades.push(grupos[i]);
                        } else {
                            console.error('Error al obtener actividades:', response.status);
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

        async generarTabla() {
            this.gruposSinActividades = [];

            // verifica si el array de agrupaciones esta vacio
            if (this.selectedGrupos.length === 0) {
                this.$root.showSnackBar('error', 'Seleccione al menos una agrupación para generar el informe');
                return;
            }

            this.actividades = [];

            // verifica si el token del usuario que apreta el boton de generar tabla es valido
            if (this.rol === "Admin") {
                await this.obtenerActividadesGrupo();
            }
            if (this.rol === "Estudiante") {
                if (this.selectedGrupos.length > 0) {
                    await this.obtenerActividadesGrupo();
                    await this.validarParticipacion();
                } else {
                    await this.validarParticipacion();
                }
            }
            this.contenidoPDF = this.actividades.flat();

            // si dentro del array el atributo "Aprobado" es false se cambia por "Rechazado"
            this.contenidoPDF.forEach(item => {
                if (item.tipo === false) {
                    item.tipo = "Privada";
                }
                if (item.tipo === true) {
                    item.tipo = "Publica";
                }
            });

            this.contenidoPDF.forEach(item => {
                if (item.success === false) {
                    item.nombre_agr = "Esta agrupacion no posee actividades";
                }
            });

            // cambia el formato de la fecha
            this.contenidoPDF.forEach(item => {
                item.fecha_creacion = new Date(item.fecha_creacion).toLocaleDateString();
            });

            // si la response es success: false elimina el item del array
            this.contenidoPDF = this.contenidoPDF.filter(item => item.success !== false);

            if (this.contenidoPDF.length === 0) {
                this.$root.showSnackBar('error', 'Esta agrupación no cuenta con actividades');
            } else {
                this.$root.showSnackBar('success', 'Informe generado correctamente');
                return this.contenidoPDF;
            }
        },

        async generarPDFAct() {
            // Crea un nuevo documento PDF
            const doc = new jsPDF();

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

                if (this.actividades.length > 0) {
                    // Genera una página para cada grupo
                    Object.keys(contenidoPorAgrupacion).forEach((nombreAgr, index) => {
                        const contenido = contenidoPorAgrupacion[nombreAgr];
                        const columnas = contenido.map(item => ({
                            'Nombre Actividad': item.nom_act,
                            'Visibilidad': item.tipo,
                            'Fecha': item.fecha_creacion,
                            'Descripción': item.descripcion,
                        }));

                        // Genera la página
                        doc.text(`Actividades de la agrupacion "${nombreAgr}"`, 10, 11, { maxWidth: 180, align: 'left' });

                        if (columnas.length === 0) {
                            doc.text('Esta agrupación no tiene actividades.', 10, 30);
                        } else {
                            // Divide las actividades en páginas de 15 actividades cada una
                            for (let i = 0; i < columnas.length; i += 15) {
                                if (i > 0 || index > 0) {
                                    doc.addPage();
                                }
                                const pageContent = columnas.slice(i, i + 15);
                                autoTable(doc, {
                                    head: [['Nombre Actividad', 'Tipo', 'Fecha', 'Descripción']],
                                    body: pageContent.map(col => [col['Nombre Actividad'], col['Visibilidad'], col['Fecha'], col['Descripción']]),
                                    columnStyles: {
                                        0: { cellWidth: 40 }, // nombre act
                                        1: { cellWidth: 20 }, // tipo
                                        2: { cellWidth: 25 }, // fecha
                                    },
                                    styles: { overflow: 'linebreak' }, // Ajusta el texto que se desborda
                                    startY: 40,
                                    pageBreak: 'auto', // Controla los saltos de página
                                    didDrawPage: function (data) {
                                        // Añadir pie de página
                                        const pageSize = doc.internal.pageSize;
                                        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                                        doc.setFontSize(10);
                                        doc.text('______________________________', 10, pageHeight - 20);
                                        doc.text('Firma del estudiante o docente', 15, pageHeight - 10);

                                        doc.text('______________________________', 125, pageHeight - 20);
                                        doc.text('Firma de Direccion de Desarrollo', 130, pageHeight - 10);
                                        doc.text('Estudiantil', 150, pageHeight - 5);
                                    }
                                });
                            }
                        }
                    });
                }

                // Añadir página para agrupaciones sin actividades
                if (this.gruposSinActividades.length > 0) {
                    doc.addPage();
                    doc.text('Las siguientes agrupaciones no cuentan con actividades realizadas', 10, 11, { maxWidth: 180, overflow: 'linebreak' });
                    const sinActividades = this.gruposSinActividades.map(grupo => [grupo.nombre_agr, new Date(grupo.fecha_creacion).toLocaleDateString()]);
                    const maxRowsPerPage = 30;
                    for (let i = 0; i < sinActividades.length; i += maxRowsPerPage) {
                        if (i > 0) {
                            doc.addPage();
                        }
                        const rows = sinActividades.slice(i, i + maxRowsPerPage);
                        autoTable(doc, {
                            head: [['Nombre de la Agrupación', 'Fecha de Creación']],
                            body: rows,
                            startY: 20,
                            didDrawPage: function (data) {
                                // Añadir pie de página
                                const pageSize = doc.internal.pageSize;
                                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                                doc.setFontSize(10);
                                doc.text('______________________________', 10, pageHeight - 20);
                                doc.text('Firma del estudiante o docente', 15, pageHeight - 10);

                                doc.text('______________________________', 125, pageHeight - 20);
                                doc.text('Firma de Direccion de Desarrollo', 130, pageHeight - 10);
                                doc.text('Estudiantil', 150, pageHeight - 5);
                            }
                        });
                    }
                }
                doc.save('Informe_Actividades_ConectaUBB.pdf');
            }
        },
        // AGRUPACIONES
        async generarInformeAgrupaciones(rut) {
            if (this.rol === "Admin") {
                const AgrupacionesPlataforma = this.gruposConID;

                AgrupacionesPlataforma.sort((a, b) => {
                    if (a.verificado === b.verificado) {
                        return 0;
                    }
                    return a.verificado === 'Verificado' ? -1 : 1;
                });

                // formatea la verificacion
                for (let i = 0; i < AgrupacionesPlataforma.length; i++) {
                    if (AgrupacionesPlataforma[i].verificado === "Noverificado") {
                        AgrupacionesPlataforma[i].verificado = "No verificado";
                    }

                    if (AgrupacionesPlataforma[i].verificado === "Verificado") {
                        AgrupacionesPlataforma[i].verificado = "Verificado";
                    }

                    if (AgrupacionesPlataforma[i].visible === "false") {
                        AgrupacionesPlataforma[i].verificado = "No verificado";
                    }

                    AgrupacionesPlataforma[i].fecha_creacion = new Date(AgrupacionesPlataforma[i].fecha_creacion).toLocaleDateString();
                    AgrupacionesPlataforma[i].id_agr = AgrupacionesPlataforma[i].nombre_agr;
                }


                // se genera el informe de agrupaciones
                const doc = new jsPDF();


                const fechaActual = new Date().toLocaleDateString();
                doc.text(`Informe de agrupaciones estudiantiles - ${fechaActual}`, 10, 10);

                const maxFilasPagina = 20; // Limite de filas por página
                let currentPage = 1;

                for (let i = 0; i < AgrupacionesPlataforma.length; i += maxFilasPagina) {
                    if (i > 0) {
                        doc.addPage();
                        currentPage++;
                    }
                    const rows = AgrupacionesPlataforma.slice(i, i + maxFilasPagina).map(item => [item.id_agr, item.fecha_creacion, item.verificado]);
                    doc.autoTable({
                        head: [['Nombre de la agrupación', 'Fecha de creación a la agrupación', 'Tipo Acreditación']],
                        body: rows,
                        columnStyles: {
                            1: { cellWidth: 80 }, // fecha
                            2: { cellWidth: 25 }, // rol
                        },
                        startY: 30,
                    });
                }

                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(12);
                    doc.text('______________________________', 10, 270);
                    doc.text('Firma del estudiante o docente', 15, 280);

                    doc.text('______________________________', 125, 270);
                    doc.text('Firma de Direccion de Desarrollo', 130, 280);
                    doc.text('Estudiantil', 150, 285);

                }
                doc.save('Informe_Agrupaciones_ConectaUBB.pdf');

            } else {
                // se obtienen las agrupaciones a las que pertenece el usuario
                const response = await fetch(`${global.BACKEND_URL}/agrupacionesPertenece/${rut}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    // se obtienen las agrupaciones a las que pertenece el usuario
                    const AgrupacionesUsuario = this.gruposConID;

                    // selecciona las agrupaciones con fecha_integracion valida distinta de NULL
                    const Agrupaciones = data.filter(item => item.fecha_integracion !== null);

                    // formatea la fecha
                    Agrupaciones.forEach(item => {
                        item.fecha_integracion = new Date(item.fecha_integracion).toLocaleDateString();
                    });

                    // cambia los id_agr por el nombre_agr
                    for (let i = 0; i < Agrupaciones.length; i++) {
                        const grupo = AgrupacionesUsuario.find(grupo => grupo.id_agr === Agrupaciones[i].id_agr);
                        if (grupo) {
                            Agrupaciones[i].id_agr = grupo.nombre_agr;
                        }
                    }

                    // se genera el informe de agrupaciones
                    const doc = new jsPDF();

                    // obtener el nombre del usuario
                    const responseUsuario = await fetch(`${global.BACKEND_URL}/usuarioPorRut/${rut}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                        },
                    });

                    if (responseUsuario.ok) {
                        const usuario = await responseUsuario.json();


                        const datosUsuario = usuario.nombres + ' ' + usuario.primer_apellido + ' ' + usuario.segundo_apellido;

                        doc.text(`Informe de pertenencia de agrupaciones`, 10, 10);
                        const fechaActual = new Date().toLocaleDateString();
                        doc.text(`${datosUsuario} - ${fechaActual}`, 10, 20);

                        const rowsPerPage = 20; // Limite de filas por página
                        let currentPage = 1;

                        for (let i = 0; i < Agrupaciones.length; i += rowsPerPage) {
                            if (i > 0) {
                                doc.addPage();
                                currentPage++;
                            }
                            const rows = Agrupaciones.slice(i, i + rowsPerPage).map(item => [item.id_agr, item.fecha_integracion, item.rol_agr]);
                            doc.autoTable({
                                head: [['Nombre de la agrupación', 'Fecha de integracion a la agrupación', 'Rol interno']],
                                body: rows,
                                columnStyles: {
                                    1: { cellWidth: 80 }, // fecha
                                    2: { cellWidth: 25 }, // rol
                                },
                                startY: 30,
                            });
                        }

                        const pageCount = doc.internal.getNumberOfPages();
                        for (let i = 1; i <= pageCount; i++) {
                            doc.setPage(i);
                            doc.setFontSize(12);
                            doc.text(`Yo, ${datosUsuario}, certifico mi participación en la agrupación(es) descrita(s) en el presente documento. Por su parte, Dirección de Desarrollo Estudiantil, mediante su firma, avala la veracidad de mi participación y confirma mi pertenencia en dicha agrupación.`, 10, 220, { maxWidth: 180, align: 'justify' });
                            doc.text('______________________________', 10, 270);
                            doc.text('Firma del estudiante o docente', 15, 280);

                            doc.text('______________________________', 125, 270);
                            doc.text('Firma de Direccion de Desarrollo', 130, 280);
                            doc.text('Estudiantil', 150, 285);

                        }
                        doc.save('Informe_Agrupaciones_ConectaUBB.pdf');

                    } else {
                        console.error('No se encontró el usuario:', responseUsuario.status);
                    }

                } else {
                    console.error('No se encontraron agrupaciones:', response.status);
                }
            }
        },

    },
    mounted() {
        this.rut = this.getRut();
        this.rol = this.getRol();
        this.obtenerGrupos();
    }
};


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
