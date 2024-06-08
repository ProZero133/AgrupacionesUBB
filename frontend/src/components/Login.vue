<template>
  <v-container class="login-container">
    <v-img src="https://intranet.ubiobio.cl/c100c0d63e8ca449b605510299f54303/img/ubb_logo_new.png" alt="Logo"></v-img>
      <h2> </h2>
    <v-form>
      <v-text-field v-model="username" label="Nombre de usuario" required></v-text-field>
      <v-text-field v-model="password" label="Contraseña" type="password" required></v-text-field>
      <v-btn type="submit" color="primary">Iniciar sesión</v-btn>
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
