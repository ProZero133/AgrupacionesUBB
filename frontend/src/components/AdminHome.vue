<template>

<v-container class="Busqueda">
  
    <v-toolbar dense floating class="search-bar">
      <v-text-field prepend-icon="mdi-magnify" hide-details single-line placeholder="Buscar por agrupacion"></v-text-field>
      <v-btn icon>
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  
</v-container>

<v-container>
    <v-row>
      <v-col cols="12" md="6" lg="3" v-for="(item, index) in items" :key="index">
        <v-card class="mx-auto" max-width="400">
          <v-img class="align-end text-white" height="200" :src="item.img" cover>
            <v-card-title>{{ item.title }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pt-4">
            {{ item.subtitle }}
          </v-card-subtitle>

          <v-card-text>
            <div>{{ item.description1 }}</div>
            <div>{{ item.description2 }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="orange" text="Share"></v-btn>
            <v-btn color="orange" text="Explore"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </template>

<style scoped>
.search-bar {
  margin-top: 3000;
}
.Busqueda {
  margin-top: 90px;
  padding-left: 500px;
  padding-right: 500px;
}
</style>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Nombre agrupacion",
          subtitle: "Lider de la agrupacion",
          description1: "Descripcion de la agrupacion",
          description2: "Whitsunday Island, Whitsunday Islands",
          img: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
        },
        {
          title: "Nombre agrupacion",
          subtitle: "Lider de la agrupacion",
          description1: "Descripcion de la agrupacion",
          description2: "Whitsunday Island, Whitsunday Islands",
          img: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
        },
        {
          title: "Nombre agrupacion",
          subtitle: "Lider de la agrupacion",
          description1: "Descripcion de la agrupacion",
          description2: "Whitsunday Island, Whitsunday Islands",
          img: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
        },
        {
          title: "Nombre agrupacion",
          subtitle: "Lider de la agrupacion",
          description1: "Descripcion de la agrupacion",
          description2: "Whitsunday Island, Whitsunday Islands",
          img: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
        },
        {
          title: "Nombre agrupacion",
          subtitle: "Lider de la agrupacion",
          description1: "Descripcion de la agrupacion",
          description2: "Whitsunday Island, Whitsunday Islands",
          img: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
        },
        // Agrega más objetos aquí para cada tarjeta que desees mostrar
      ],
    };
  },
};
</script>