<template>
  <v-container class="container-loginrut">

    <v-switch v-model="showLoginByRut" label="Utilizar Rut para iniciar sesion" class="switch-custom"></v-switch>

    <v-img src="https://intranet.ubiobio.cl/c100c0d63e8ca449b605510299f54303/img/ubb_logo_new.png" alt="Logo"></v-img>
    <v-form v-if="showLoginByRut" class="form-loginrut" @submit.prevent="login">
      <v-label>Iniciar sesión con RUT</v-label>
      <v-text-field class="tfCredenciales" v-model="username" label="Rut sin puntos ni digito verificador"
        required></v-text-field>
      <v-btn @click="login" color="primary">Enviar</v-btn>
    </v-form>

    <v-form v-else class="form-logincorreo" @submit.prevent="login">
      <v-label>Iniciar sesión con Correo institucional</v-label>
      <v-text-field class="tfCorreo" v-model="email" label="Correo institucional" required></v-text-field>
      <v-btn @click="login" color="primary">Enviar</v-btn>
    </v-form>

    <v-dialog v-model="dialog" max-width="350">
      <v-card>
        <v-card-title class="headline">Ingrese el código de verificación</v-card-title>
        <v-card-text>
          <v-text-field v-model="verificationCode" label="Código de verificación" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="verifyCode">Verificar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      dialog: false,
      email: '',
      username: '',
      password: '',
      serverCode: '',
      verificationCode: '',
      showLoginByRut: false,
      tokenValue: this.$cookies.get('token'),
      authToken: this.$cookies.get('AuthToken'),
      tokenAutorizacion: this.$cookies.get('TokenAutorizacion'),
      userData: {},
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      try {
        let data = {};
        let response = {};
        if (this.showLoginByRut === false) {
          response = await fetch(`${global.BACKEND_URL}/EmailLogin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.email }),
          });
        } else {
          response = await fetch(`${global.BACKEND_URL}/RutLogin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rut: this.username }),
          });
        }
        data = await response.json();

        console.log(data);
        if (response.ok && data.success) {
          this.userData = data.result.usuario;
          this.serverCode = data.codigo;
          this.$cookies.set('AuthToken', data.token);
          this.dialog = true;
        } else {
          this.isLoading = false; // Desactiva la pantalla de carga si hay un error
          //Snackbar de error
          this.$root.showSnackBar('error', data.message, 'Operación fallida');
        }
      } catch (error) {
        console.error('Error en el login:', error);
        this.isLoading = false;
      }
    },
    async verifyCode() {
      if (this.verificationCode === this.serverCode) {
        try {
          const nombre = this.userData.nombre;
          const rut = this.userData.rut;
          const role = this.userData.rol;
          const email = this.userData.correo;
          const carrera = this.userData.carrera;
          this.tokenValue = `rol=${role}&nombre=${nombre}&rut=${rut}&email=${email}&carrera=${carrera}`;
          this.$cookies.set('token', this.tokenValue);

          const authToken = this.$cookies.get('AuthToken');
          const response = await fetch(`${global.BACKEND_URL}/TokenAutorizacion`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.$cookies.get('AuthToken')}`,
            },
          });
          const data = await response.json();
          this.$cookies.set('TokenAutorizacion', data.token);
          if (role === 'Admin') {
            this.$router.push(`/api/adminhome`);
          } else {
            this.$router.push(`/api/home`);
          }
        } catch (error) {
          console.error('Error en la verificación del código:', error);
        }
      } else {
        this.$root.showSnackBar('error', 'Codigo incorrecto', 'Operación fallida');
        console.error('El código ingresado no coincide');
      }
    }
  },
};

</script>

<style scoped>
.container-loginrut {
  background: rgba(255, 255, 255, 0.8);
  /* Fondo blanco semi-transparente */
  border: 1px solid rgba(0, 0, 0, 0.2);
  /* Borde negro semi-transparente */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  /* Sombra negra semi-transparente */
  padding: 30px;
  /* Espacio interior */
  margin-top: 100px;
  border-radius: 15px;
  /* Bordes redondeados */
  width: 35%;
  min-width: 400px;
  max-width: 400px;
}

.switch-custom {
  margin-bottom: 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.form-loginrut {
  position: center;
  display: table;
  margin-left: 5px;
  margin-right: auto;
}

.form-logincorreo {
  margin-top: 50px;
  position: center;
  margin-left: 1vw;
  margin-right: 400px;
}

.tfCorreo {
  min-width: 300px;
}

.tfCredenciales {
  min-width: 350px;
}
</style>
