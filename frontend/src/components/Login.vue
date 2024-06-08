<template>
  <v-container class="login-container">
    <v-img src="https://intranet.ubiobio.cl/c100c0d63e8ca449b605510299f54303/img/ubb_logo_new.png" alt="Logo"></v-img>
      <h2> </h2>
    <v-form>
      <v-label>Iniciar sesión con credenciales institucionales</v-label>
      <v-text-field v-model="username" label="Rut" required></v-text-field>
      <v-text-field v-model="password" label="Contraseña" type="password" required></v-text-field>
      <v-btn type="submit" color="primary">Iniciar sesión</v-btn>
    </v-form>
    <v-form>
      <v-label>o</v-label>
      <v-text-field v-model="email" label="Correo institucional" required></v-text-field>
      <v-btn @click="login" color="primary">Enviar</v-btn>
    </v-form>
  </v-container>
</template>

<script>

export default {
  name: 'Login',

  data: () => ({
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
    },
  },
}

</script>
