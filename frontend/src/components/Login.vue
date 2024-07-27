<template>
  <v-container class="container-loginrut">
    
    <v-switch v-model="showLoginByRut" label="Utilizar Rut para iniciar sesion" class="switch-custom" ></v-switch>

    <v-img src="https://intranet.ubiobio.cl/c100c0d63e8ca449b605510299f54303/img/ubb_logo_new.png" alt="Logo"></v-img>
    <v-form v-if="showLoginByRut" class="form-loginrut">
      <v-label>Iniciar sesión con credenciales institucionales</v-label>
      <v-text-field class="tfCredenciales" v-model="username" label="Rut" required></v-text-field>
      <v-text-field class="tfCredenciales" v-model="password" label="Contraseña" type="password"
        required></v-text-field>
      <v-btn type="submit" color="primary">Iniciar sesión</v-btn>
    </v-form>

    <v-form v-else class="form-logincorreo">
      <v-label>Iniciar sesión con Correo institucional</v-label>
      <v-text-field class="tfCorreo" v-model="email" label="Correo institucional" required></v-text-field>
      <v-btn @click="login" color="primary">Enviar</v-btn>
      <div v-if="isLoading" class="loading-overlay">
        Cargando...
      </div>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isLoading: false,
      email: '',
      username: '',
      password: '',
      showLoginByRut: true, // Estado del slider, inicialmente muestra el formulario por RUT
      tokenValue: this.$cookies.get('token')
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      try {
        const role = 'Estudiante';
        this.tokenValue = `rol=${role}`;
        this.$cookies.set('token', this.tokenValue);
        const response = await fetch('http://localhost:3000/EmailLogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email }),
        });

        if (response.ok) {
          this.checkAuthenticationStatus();
        } else {
          this.isLoading = false; // Desactiva la pantalla de carga si hay un error
        }
      } catch (error) {
        console.error('Error en el login:', error);
        this.isLoading = false;
      }
    },
    async checkAuthenticationStatus() {
      const checkStatus = async () => {
        const response = await fetch('http://localhost:3000/api/auth/status');
        const data = await response.json();
        if (data.isAuthenticated) {
          this.isLoading = false; // Desactiva la pantalla de carga
          // Aquí puedes redirigir al usuario o realizar alguna acción adicional
        } else {
          setTimeout(checkStatus, 5000); // Reintenta después de 5 segundos
        }
      };

      checkStatus();
    },
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
  min-width: 350px;
}

.tfCredenciales {
  min-width: 350px;
}
</style>
