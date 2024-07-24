<template>
  <v-container class="container-loginrut">
    <h2> </h2>
    <v-form class="form-loginrut">
      <v-img src="https://intranet.ubiobio.cl/c100c0d63e8ca449b605510299f54303/img/ubb_logo_new.png" alt="Logo"></v-img>
      
      <v-label>Iniciar sesión con credenciales institucionales</v-label>
      <v-text-field v-model="username" label="Rut" required></v-text-field>
      <v-text-field v-model="password" label="Contraseña" type="password" required></v-text-field>
      <v-btn type="submit" color="primary">Iniciar sesión</v-btn>
    </v-form>
  </v-container>

  <v-container class="container-logincorreo">
    <v-form class="form-logincorreo">
      <v-label>o</v-label>
      <v-text-field v-model="email" label="Correo institucional" required></v-text-field>
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

  data: () => ({
    isLoading: false,
    email: '',
    username: '',
    password: '',
  }),
  methods: {
    async login() {
      const response = await fetch('http://localhost:3000/EmailLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email }),
      });

      if (response.ok) {
        // El correo se ha enviado correctamente, ahora espera a que el usuario haga clic en el enlace
        this.checkAuthenticationStatus();
      } else {
        // Manejo de error, por ejemplo, mostrar un mensaje al usuario
        this.isLoading = false; // Desactiva la pantalla de carga si hay un error
      }
    },
    async checkAuthenticationStatus() {
      const checkStatus = async () => {
        // Reemplaza '/api/auth/status' con tu endpoint real para verificar el estado de autenticación
        const response = await fetch('http://localhost:3000/api/auth/status');
        const data = await response.json();
        if (data.isAuthenticated) {
          this.isLoading = false; // Desactiva la pantalla de carga
          // Aquí puedes redirigir al usuario a otra página o realizar alguna acción adicional
        } else {
          setTimeout(checkStatus, 5000); // Reintenta después de 5 segundos
        }
      };

      checkStatus();
    },
  },
}

</script>

<style>
template{
  background: url('..\assets\pattern.jpg');
  background-position:center;
  background-repeat: repeat;
  background-size: auto;
  height: 100vh;
  width: 100vw;
}

.container-loginrut {
  background: rgba(255, 255, 255, 0.8);     /* Fondo blanco semi-transparente */
  border: 1px solid rgba(0, 0, 0, 0.2);     /* Borde negro semi-transparente */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);  /* Sombra negra semi-transparente */
  padding: 30px;                              /* Espacio interior */
  margin-top: 100px;
  border-radius: 15px;                        /* Bordes redondeados */
  width: 32%;
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
  margin-left: auto;
  margin-right: auto;
}

.form-logincorreo {
  margin-top: 50px;
  position: center;
  margin-left: 400px;
  margin-right: 400px;
}
</style>