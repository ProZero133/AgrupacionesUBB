<template>
  <div>
    <router-view />
    <snack-bar ref="snackBar" v-show="false"></snack-bar>
  </div>
</template>

<script>
  export default {
    data: () => (
      {
        envAPI: import.meta.env.VITE_API_OFFER_URL,
      }
    ),
    methods: {
      showSnackBar(color, title, text, alternativeText) {
        this.$refs.snackBar.show(color, title, text, alternativeText);
      }
    }
  }
</script>