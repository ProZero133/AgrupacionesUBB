import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

import SnackBar from './layouts/global/SnackBar.vue';
import Overlay from './layouts/global/Overlay.vue';

const app = createApp(App)
  .use(vuetify)
  .use(router)

app.component("snack-bar", SnackBar)
app.component("overlay", Overlay)
app.mount('#app')