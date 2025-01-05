<template>
    <v-container>
        <v-card class="mb-4">
            <v-card-title class="text-wrap">
                <h1>Administración de Usuarios</h1>
                <h4>Listado de usuarios registrados como administradores de la plataforma</h4>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="admin in administradores" :key="admin.rut" cols="12" md="4">
                        <v-card class="mb-4">
                            <v-card-title>
                                <v-row align="center" justify="space-between" class="w-100">
                                    <v-col cols="auto" class="text-wrap">
                                        {{ admin.nombres }} {{ admin.primer_apellido }} {{ admin.segundo_apellido }}
                                    </v-col>
                                </v-row>
                            </v-card-title>
                            <v-card-text>
                                <p><strong>RUT:</strong> {{ admin.rut }}</p>
                                <p><strong>Correo:</strong> {{ admin.correo }}</p>
                                <p><strong>Rol en el establecimiento:</strong> {{ admin.rol }}</p>
                            </v-card-text>
                            <v-col cols="auto">
                                <v-row justify="end" style="margin: 0%;">
                                    <v-btn icon @click="openDialog(admin)">
                                        <v-icon color="red">mdi-delete</v-icon>
                                    </v-btn>
                                </v-row>
                            </v-col>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Buscador de usuarios -->
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-title style="font-size: 1.5rem; font-weight: bold;">Ingrese el correo de un usuario</v-title>
                    <h4>para registrar como administrador</h4>
                    <v-text-field label="Ingrese nombre.apellido" v-model="valorTextBoxUsuario"
                        @keyup.enter="valorTextBoxUsuario.length >= 4 ? obteneralgo() : $root.showSnackBar('error', 'Ingrese minimo 4 caracteres')"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-data-table :headers="headersBuscadorUsuario" :items="usuariosBuscados" class="elevation-15">
                    <template v-slot:item.correo="{ item }">
                        <v-chip color="primary" dark>{{ item.correo }}</v-chip>
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-btn color="primary" @click="openRegisterDialog(item)">Registrar como Administrador</v-btn>
                    </template>
                </v-data-table>
            </v-row>
        </v-container>

        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">Confirmar eliminación</v-card-title>
                <v-card-text>
                    <p>¿Está seguro de eliminar a este administrador?</p>
                    <v-text-field v-model="password" label="Contraseña" type="password" required></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="red darken-1" text @click="confirmarEliminar">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="registerDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">Confirmar registro</v-card-title>
                <v-card-text>
                    <p>¿Está seguro de registrar a este usuario como un administrador?</p>
                    <v-text-field v-model="AdminPasword" label="Ingrese su contraseña" type="password"
                        required></v-text-field>
                    <v-text-field v-model="newAdminPassword" label="Ingrese la contraseña para el nuevo administrador"
                        type="password" required></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="registerDialog = false">Cancelar</v-btn>
                    <v-btn color="green darken-1" text @click="confirmarRegistro">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
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
import conectaUBB from '../assets/ConectaUBBLine.png';
export default {

    name: 'AdministracionDeUsuarios',
    data() {
        return {
            LogoPagina: conectaUBB,
            administradores: [],
            dialog: false,
            registerDialog: false,
            selectedAdmin: null,
            selectedUser: null,
            password: '',
            newAdminPassword: '',
            AdminPasword: '',
            valorTextBoxUsuario: '',
            usuariosBuscados: [],
            headersBuscadorUsuario: [
                { text: 'Nombres', value: 'nombres' },
                { text: 'Primer Apellido', value: 'primer_apellido' },
                { text: 'Segundo Apellido', value: 'segundo_apellido' },
                { text: 'Correo', value: 'correo' },
                { text: 'Rol', value: 'rol' },
                { text: 'Acciones', value: 'action', sortable: false },
            ],
        };
    },
    methods: {
        async verAdministradores() {
            try {
                const response = await fetch(`${global.BACKEND_URL}/administradores`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('AuthToken')}`,
                    },
                });
                const data = await response.json();
                this.administradores = data;
            } catch (error) {
                this.$root.showSnackBar('error', 'Error', 'No se pudo obtener la lista de administradores');
            }
        },
        async eliminarAdministrador(rut) {
            try {
                const response = await fetch(`${global.BACKEND_URL}/eliminaradministrador/${rut}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('AuthToken')}`,
                    },
                });
                if (response.ok) {
                    this.verAdministradores();
                    this.$root.showSnackBar('success', 'Administrador eliminado', 'El administrador ha sido eliminado correctamente');
                } else {
                    this.$root.showSnackBar('error', 'Error', 'No se pudo eliminar el administrador');
                }
            } catch (error) {
                this.$root.showSnackBar('error', 'Error', 'No se pudo eliminar el administrador');
            }
        },
        openDialog(admin) {
            this.selectedAdmin = admin;
            this.dialog = true;
        },
        async confirmarEliminar() {
            if (!this.password) {
                this.$root.showSnackBar('error', 'Error', 'Debe ingresar una contraseña');
                return;
            }

            try {
                const rut = this.selectedAdmin.rut.toString();
                const response = await fetch(`${global.BACKEND_URL}/eliminaradministrador`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('AuthToken')}`,
                    },
                    body: JSON.stringify({ password: this.password, rut: rut }),
                });
                const data = await response.json();
                if (response.ok) {
                    this.verAdministradores();
                    this.$root.showSnackBar('success', 'Administrador eliminado', 'El administrador ha sido eliminado correctamente');
                } else {
                    this.$root.showSnackBar('error', 'Error', data.message);
                }
            } catch (error) {
                this.$root.showSnackBar('error', 'Error', 'No se pudo eliminar el administrador');
            } finally {
                this.dialog = false;
                this.password = '';
            }
        },
        async obteneralgo() {
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
        openRegisterDialog(user) {
            this.selectedUser = user;
            this.registerDialog = true;
        },
        async confirmarRegistro() {
            if (!this.newAdminPassword) {
                this.$root.showSnackBar('error', 'Error', 'Debe ingresar una contraseña');
                return;
            }

            try {
                const response = await fetch(`${global.BACKEND_URL}/nuevoAdministrador/${this.selectedUser.rut}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.$cookies.get('AuthToken')}`,
                    },
                    body: JSON.stringify({ contrasena: this.newAdminPassword, contrasenaAdmin: this.AdminPasword }),
                });
                const data = await response.json();
                if (response.ok) {
                    this.verAdministradores();
                    this.$root.showSnackBar('success', 'Administrador registrado', 'El usuario ha sido registrado como administrador correctamente');
                } else {
                    this.$root.showSnackBar('error', 'Error', data.message);
                }
            } catch (error) {
                this.$root.showSnackBar('error', 'Error', 'No se pudo registrar al administrador');
            } finally {
                this.registerDialog = false;
                this.newAdminPassword = '';
            }
        },
    },
    mounted() {
        this.verAdministradores();
    },
};
</script>

<style scoped>
.mb-4 {
    margin-top: 5vh;
}
</style>