// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { es } from 'vuetify/locale'
// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  locale: {
    locale: 'es',
    fallbackLocale: 'en',
    messages: { es },
  },
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
})
