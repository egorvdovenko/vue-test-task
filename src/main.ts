import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { setupI18n } from '@/plugins/i18n'

const i18n = setupI18n()
const app = createApp(App)

app.use(createPinia())
app.use(i18n)

app.mount('#app')
