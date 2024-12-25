<template>
  <v-footer app style="background-color: #014898;" dark class="footer">
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
          <div class="text-center"  style="color: white;">
            <p>Conectando agrupaciones Y estudiantes de
              la Universidad del Bío-Bío.
            </p>
            <p>Conecta UBB es una iniciativa estudiantil,
              con apoyo de la Dirección de Desarrollo
              Estudiantil.</p>
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
            <v-btn icon href="https://www.instagram.com/ddeconcepcion/?hl=es" target="_blank">
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
  position: relative;
  /* Cambia a relative o static */
  width: 100%;
  margin-top: 20px;
  /* Ajusta este valor según sea necesario */
}
</style>