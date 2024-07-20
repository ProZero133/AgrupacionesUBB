<template>

  <v-container cols="12"></v-container>
  <v-container cols="12" >
    <v-img
        :width="1600"
        :height="200"
        aspect-ratio="16/9"
        cover
        class="mx-auto"
        src="https://t3.ftcdn.net/jpg/04/56/11/06/360_F_456110688_0RbzwTy8UVyZwtObuxr8lb3XRr28R24X.jpg"
      ></v-img>
    <v-card class="mx-auto px-12 py-8 texto" max-width="1600">
      <h1 class="texto">{{ groupName }}</h1>
      <p class="text-left">{{ groupDescription }}</p>
    </v-card>
  </v-container>

</template>

<script>
import addImage from '../assets/imagePlaceholder.png';
  
  export default {
  
    data: () => ({
      panita: '',
      groupName: 'Club de Tetris UBB',
      groupDescription: 'Bienvenidos! Somos un grupo de entusiastas del Tetris que nos reunimos para jugar y compartir experiencias. Jugamos Notris, Nullpomino y PPT. Si te gusta el Tetris, no dudes en unirte a nosotros!'
    }),
    methods: {

    },
  }
  
</script>

<style>
.texto {
  border-radius: 0px;
}
</style>