<template>
  <v-container>
    <v-col cols="12">
        <v-img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif"
          class="my-3" contain height="500" />
      </v-col>
      <v-col cols="12">
        <form @submit.prevent="login">
          <input type="email" v-model="email" placeholder="Enter your email" required>
          <button type="submit">Login</button>
        </form>
      </v-col>
  </v-container>
</template>

<script>

export default {
  name: 'HelloWorld',

  data: () => ({
  }),
  methods: {
    async login() {
      const response = await fetch('http://localhost:3000/login', {
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
