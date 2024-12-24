<template>
  <v-footer app color="primary" dark class="footer">
    <v-container>
      <v-row justify="space-between" align="center">
        <!-- Logo -->
        <v-col cols="12" md="4">
          <img src="@/assets/logo.png" alt="Logo" height="40" />
        </v-col>

        <!-- Información de contacto -->
        <v-col cols="12" md="4">
          <div class="text-center">
            <p>Contáctanos: contacto@tuplataforma.com</p>
            <p>Teléfono: +123 456 789</p>
          </div>
        </v-col>

        <!-- Redes sociales -->
        <v-col cols="12" md="4">
          <div class="text-right">
            <v-btn icon href="https://facebook.com/" target="_blank">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon href="https://twitter.com/" target="_blank">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon href="https://instagram.com/" target="_blank">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  position: relative; /* Cambia a relative o static */
  width: 100%;
  margin-top: 20px; /* Ajusta este valor según sea necesario */
}
</style>