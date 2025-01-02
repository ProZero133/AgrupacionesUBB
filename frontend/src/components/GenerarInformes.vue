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
                        <v-btn color="#014898" @click="generarInformeUsuario(item.rut)">generar informe</v-btn>
                    </template>
                </v-data-table>
            </v-row>
        </v-container>
    </v-tab-item>
    <!------------------------------------------------------------>



    <!-------------------- TAB ACTIVIDADES ----------------------->
    <v-tab-item value="Actividades" v-if="tab === 'Actividades'">
        <v-container class="containerActividades" grid-list-xs>
            <v-card class="ContenedorSelector" elevation="15">
                <v-card-title class="ContenedorTitulo">
                    <h1 class="Titulo" style="margin: 2%;">Agrupaciones usuario </h1>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-select chips multiple v-model="selectedGrupos" :items="grupos" item-text="nombre_agr"
                                    elevation="24" item-value="id_agr" label="Seleccione un grupo" required
                                    :search-input.sync="search"></v-select>
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

        <v-container class="containerHistorialActividades" grid-list-xs>
            <v-card class="ContenedorInforme" elevation="24">
                <v-card-title class="ContenedorGrafico">
                    <h1 class="d-flex justify-start" style="margin: 2%;">Informe de participacion en actividades</h1>

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
                    <h1 class="Titulo" style="margin: 2%;">Generar informe de agrupaciones</h1>
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
import 'jspdf-autotable';

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

        // datos de la tabla de usuarios
        headersBuscadorUsuario: [
            { title: 'Nombres', value: 'nombres' },
            { title: 'Primer Apellido', value: 'primer_apellido' },
            { title: 'Segundo Apellido', value: 'segundo_apellido' },
            { title: 'Correo', value: 'correo' },
            { title: 'Rol', value: 'rol' },
            { value: 'action', align: 'center' },
        ],

        // variables tab Actividades
        // nombre grupos usuario seleccionados
        selectedGrupos: [],
        Actividades: ['Actividades'],
        actividades: [],
        publicaciones: [],
        formularios: [],

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

        // USUARIOS

        async substringUsuarioBDD() {
            // llama a la ruta /correoSubString/:correo
            const response = await fetch(`${global.BACKEND_URL}/correoSubString/${this.valorTextBoxUsuario}`, {
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

            // primer recorrido: busca las agrupaciones a las que pertenece el usuario, genero el pdf con las agrupaciones a las que entro el usuario
            // segundo recorrido: busca las actividades en las que participo el usuario, si hay actividades, las añade al pdf, si no hay actividades entonces se imprime el pdf con las agrupaciones

            // se obtienen las agrupaciones del usuario
            const responseAgrupaciones = await fetch(`${global.BACKEND_URL}/agrupacionesPertenece/${rut}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                },
            });
            if (responseAgrupaciones.ok) {
                const agrupaciones = await responseAgrupaciones.json();

                // busca las actividades en las que participo el usuario
                const responseActividades = await fetch(`${global.BACKEND_URL}/actividadesparticipante/${rut}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                    },
                });
                if (responseActividades.ok) {
                    const actividades = await responseActividades.json();

                    if (!Array.isArray(actividades)) {
                        console.error('La respuesta de actividades no es un arreglo:', actividades);
                        this.$root.showSnackBar('error', 'Error al obtener las actividades del usuario');
                        return;
                    }

                    // formatea la fecha
                    agrupaciones.forEach(item => {
                        item.fecha_integracion = new Date(item.fecha_integracion).toLocaleDateString();
                    });

                    // cambia los id_agr por el nombre_agr
                    agrupaciones.forEach(item => {
                        const grupo = this.gruposConID.find(grupo => grupo.id_agr === item.id_agr);
                        item.id_agr = grupo ? grupo.nombre_agr : 'Sin Agrupación';
                    });

                    // valida las actividades por id_agr
                    actividades.forEach(item => {
                        const grupo = this.gruposConID.find(grupo => grupo.id_agr === item.id_agr);
                        item.id_agr = grupo ? grupo.nombre_agr : 'Sin Agrupación';
                    });

                    const doc = new jsPDF();

                    // Título del informe
                    doc.text('Informe de Usuario', 10, 10);

                    // Tabla de agrupaciones
                    doc.autoTable({
                        head: [['Nombre de la Agrupación', 'Fecha de Integración']],
                        body: agrupaciones.map(item => [item.id_agr, item.fecha_integracion]),
                        startY: 20,
                    });

                    // Tabla de actividades por agrupación
                    if (actividades.length > 0) {
                        doc.addPage();

                        const actividadesPorAgrupacion = actividades.reduce((acc, actividad) => {
                            if (!acc[actividad.id_agr]) {
                                acc[actividad.id_agr] = [];
                            }
                            acc[actividad.id_agr].push(actividad);
                            return acc;
                        }, {});

                        Object.keys(actividadesPorAgrupacion).forEach((id_agr, index) => {
                            if (index > 0) {
                                doc.addPage();
                            }
                            const actividades = actividadesPorAgrupacion[id_agr];

                            // busca el nombre de la agrupacion
                            const nombreAgrupacion = agrupaciones.find(agrupacion => agrupacion.id_agr === id_agr)?.nombre_agr || 'Sin Nombre';

                            doc.text(`Actividades del usuario en ${nombreAgrupacion}`, 10, 20);
                            doc.autoTable({
                                head: [['Nombre Actividad', 'Fecha', 'Descripción']],
                                body: actividades.map(act => [act.nom_act, new Date(act.fecha_creacion).toLocaleDateString(), act.descripcion]),
                                columnStyles: {
                                    0: { cellWidth: 50 }, // nombre act
                                    1: { cellWidth: 30 }, // fecha
                                },
                                startY: 30,
                            });
                        });
                    }

                    // Guardar el PDF
                    doc.save('Informe_Usuario.pdf');
                } else {
                    const doc = new jsPDF();

                    // Título del informe
                    doc.text('Informe de Usuario', 10, 10);

                    // Tabla de agrupaciones
                    doc.autoTable({
                        head: [['Nombre de la Agrupación', 'Fecha de Integración']],
                        body: agrupaciones.map(item => [item.id_agr, item.fecha_integracion]),
                        startY: 20,
                    });

                    // Guardar el PDF
                    doc.save('Informe_Usuario.pdf');

                    this.$root.showSnackBar('error', 'Este usuario no ha participado en ninguna actividad');
                }
            } else {
                this.$root.showSnackBar('error', 'Este usuario no pertenece a ninguna agrupación');
            }
        },

        // ACTIVIDADES

        async obtenerGrupos() {
            try {

                if (this.rol === "Admin") {
                    const response = await fetch(`${global.BACKEND_URL}/agrupaciones`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.$cookies.get('TokenAutorizacion')}`,
                        },
                    });

                    const data = await response.json();

                    if (response.ok) {
                        this.grupos = data.map(grupo => grupo.nombre_agr);
                        this.gruposConID = data.map(grupo => ({
                            id_agr: grupo.id_agr,
                            nombre_agr: grupo.nombre_agr,
                        }));

                    } else {
                        console.error('No se encontraron agrupupaciones:', response.status);
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
                            this.$root.showSnackBar('error', 'Esta agrupacion no cuenta con actividades');
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

            // verifica si el token del usuario que apreta el boton de generar tabla es valido

            this.actividades = [];

            if (this.rol === "Admin") {
                await this.obtenerActividadesGrupo();
            } else {
                await this.obtenerActividadesGrupo();
                await this.validarParticipacion();
            }
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

            return this.contenidoPDF;
        },

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
                        'Visibilidad': item.tipo ? 'Privada' : 'Publica',
                        'Fecha': item.fecha_creacion,
                        'Descripción': item.descripcion,
                    }));



                    // Genera la página
                    doc.text(`Actividades de la agrupacion "${nombreAgr}"`, 10, 11);
                    doc.autoTable({
                        head: [['Nombre Actividad', 'Tipo', 'Fecha', 'Descripción']],
                        body: columnas.map(col => [col['Nombre Actividad'], col['Visibilidad'], col['Fecha'], col['Descripción']]),
                        columnStyles: {
                            0: { cellWidth: 40 }, // nombre act
                            1: { cellWidth: 20 }, // tipo
                            2: { cellWidth: 25 }, // fecha
                        },
                        styles: { overflow: 'linebreak' }, // Ajusta el texto que se desborda
                    });
                });

                doc.setFontSize(10);
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.text('________________________________', 10, 270);
                    doc.text('Firma del estudiante', 25, 280);
                }
                doc.save('Informe_Actividades_ConectaUBB.pdf');
            }
        },

        // AGRUPACIONES
        async generarInformeAgrupaciones(rut) {
            if (this.rol === "Admin") {

                const AgrupacionesUsuario = this.gruposConID;

                // cambia los id_agr por el nombre_agr
                AgrupacionesUsuario.forEach(item => {
                    item.id_agr = item.nombre_agr;
                });

                // se genera el informe de agrupaciones
                const doc = new jsPDF();


                const fechaActual = new Date().toLocaleDateString();
                doc.text(`Informe de pertenencia de agrupaciones del usuario ${fechaActual}`, 10, 10);

                const rowsPerPage = 20; // Limite de filas por página
                let currentPage = 1;

                for (let i = 0; i < AgrupacionesUsuario.length; i += rowsPerPage) {
                    if (i > 0) {
                        doc.addPage();
                        currentPage++;
                    }
                    const rows = AgrupacionesUsuario.slice(i, i + rowsPerPage).map(item => [item.id_agr, item.fecha_integracion, item.rol_agr]);
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
                    this.cambioIDGrupo = Agrupaciones.forEach(item => {
                        const grupo = AgrupacionesUsuario.find(grupo => grupo.id_agr === item.id_agr);
                        item.id_agr = grupo ? grupo.nombre_agr : 'Sin Agrupación';
                    });


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

                        doc.text(`Informe de pertenencia de agrupaciones del usuario`, 10, 10);
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